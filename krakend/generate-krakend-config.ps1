param(
  [string]$CollectionPath = (Join-Path $PSScriptRoot "..\generate-service-test.postman_collection.json"),
  [string]$OutputPath = (Join-Path $PSScriptRoot "krakend.json"),
  [string]$GraphQLHost = "http://host.docker.internal:8084",
  [string]$GraphQLApiPath = (Join-Path $PSScriptRoot "..\TestDemoGraphQLOracle\src\main\java\com\app\test\graphql\ApiGraphQL.java"),
  [string]$DtoDirectory = (Join-Path $PSScriptRoot "..\TestDemoGraphQLOracle\src\main\java\com\app\test\dto")
)

$ErrorActionPreference = "Stop"

function Find-CollectionItem {
  param(
    [Parameter(Mandatory = $true)] $Items,
    [Parameter(Mandatory = $true)] [string] $Name
  )

  return $Items | Where-Object { $_.name -eq $Name } | Select-Object -First 1
}

function Get-RequestItems {
  param(
    [Parameter(Mandatory = $true)] $Items,
    [string[]] $Path = @()
  )

  foreach ($item in $Items) {
    $currentPath = $Path + $item.name

    if ($item.request) {
      [pscustomobject]@{
        Name = $item.name
        Path = $currentPath
        Request = $item.request
      }
    }

    if ($item.item) {
      Get-RequestItems -Items $item.item -Path $currentPath
    }
  }
}

function Get-EndpointPath {
  param([Parameter(Mandatory = $true)] $Request)

  if ($Request.url.path -and $Request.url.path.Count -gt 0) {
    return "/" + (($Request.url.path | ForEach-Object { [string]$_ }) -join "/")
  }

  $rawUrl = [string]$Request.url.raw
  $uri = [System.Uri]::new($rawUrl)
  return $uri.AbsolutePath
}

function Get-RestBody {
  param([Parameter(Mandatory = $true)] $Request)

  if (-not $Request.body -or $Request.body.mode -ne "raw" -or [string]::IsNullOrWhiteSpace($Request.body.raw)) {
    return $null
  }

  try {
    return $Request.body.raw | ConvertFrom-Json
  } catch {
    throw "El body REST no es JSON valido: $($Request.url.raw). Error: $($_.Exception.Message)"
  }
}

function Get-JsonPropertyNames {
  param([Parameter(Mandatory = $true)] $JsonObject)

  if (-not $JsonObject.PSObject.Properties) {
    return @()
  }

  return @($JsonObject.PSObject.Properties | ForEach-Object { $_.Name })
}

function Convert-JavaTypeToGraphQLType {
  param(
    [Parameter(Mandatory = $true)] [string] $JavaType,
    [bool] $IsJsonField = $false
  )

  if ($IsJsonField) {
    return "Json"
  }

  $type = ($JavaType -replace "\s+", "").Trim()
  $type = $type -replace "^com\.app\.test\.model\.", ""
  $type = $type -replace "^java\.lang\.", ""

  switch -Regex ($type) {
    "^int$" { return "Int!" }
    "^Integer$" { return "Int" }
    "^long$" { return "Long!" }
    "^Long$" { return "Long" }
    "^boolean$" { return "Boolean!" }
    "^Boolean$" { return "Boolean" }
    "^(java\.math\.)?BigDecimal$" { return "BigDecimal" }
    "^String$" { return "String" }
    "^(java\.sql\.)?Date$" { return "Date" }
    "^(java\.sql\.)?Timestamp$" { return "SqlTimestamp" }
    "^byte\[\]$" { return "Base64String" }
    "^GsNumberTabArray<.*>$" { return "[BigDecimal]" }
    "^GsIntegerTabArray<.*>$" { return "[Int]" }
    "^GsBooleanTabArray<.*>$" { return "[Boolean]" }
    "^GsDateTabArray<.*>$" { return "[Date]" }
    "^GsTimestampTabArray<.*>$" { return "[SqlTimestamp]" }
    "^GsVarchar2TabArray<.*>$" { return "[String]" }
    "^List<(?<inner>[A-Za-z0-9_\.]+)>$" {
      $inner = $Matches.inner -replace "^com\.app\.test\.model\.", ""
      return "[$($inner)Input]"
    }
    "^[A-Za-z0-9_]+$" { return "$($type)Input" }
    default { throw "No se pudo convertir el tipo Java '$JavaType' a tipo GraphQL." }
  }
}

function Get-RequestTypeDefinitions {
  param([Parameter(Mandatory = $true)] [string] $Directory)

  $definitions = @{}

  foreach ($file in Get-ChildItem -Path $Directory -Filter "*Request.java") {
    $lines = Get-Content -Path $file.FullName
    $className = $null
    $fields = @{}
    $pendingAnnotations = New-Object System.Collections.Generic.List[string]

    foreach ($line in $lines) {
      if ($line -match "public\s+class\s+(?<class>[A-Za-z0-9_]+)") {
        $className = $Matches.class
        continue
      }

      $trimmed = $line.Trim()

      if ($trimmed.StartsWith("@")) {
        $pendingAnnotations.Add($trimmed)
        continue
      }

      if ($trimmed -eq "") {
        continue
      }

      if ($line -match "^\s*private\s+(?:static\s+final\s+)?(?<type>[^;=]+?)\s+(?<name>[A-Za-z_][A-Za-z0-9_]*)\s*(?:=[^;]*)?;") {
        $fieldName = $Matches.name

        if ($fieldName -ne "serialVersionUID") {
          $javaType = $Matches.type.Trim()
          $isJsonField = (($pendingAnnotations -join " ") -match "GraphQLJsonField")
          $fields[$fieldName] = [pscustomobject]@{
            JavaType = $javaType
            GraphQLType = Convert-JavaTypeToGraphQLType -JavaType $javaType -IsJsonField $isJsonField
            IsJsonField = $isJsonField
          }
        }

        $pendingAnnotations.Clear()
        continue
      }

      $pendingAnnotations.Clear()
    }

    if ($className) {
      $definitions[$className] = $fields
    }
  }

  return $definitions
}

function Get-MutationRequestTypes {
  param([Parameter(Mandatory = $true)] [string] $Path)

  $source = Get-Content -Raw -Path $Path
  $mutationRegex = [regex]::new('@GraphQLMutation\(name\s*=\s*"(?<name>[^"]+)"\)\s*public\s+(?<signature>.*?)(?=\{)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $requestTypes = @{}

  foreach ($match in $mutationRegex.Matches($source)) {
    $name = $match.Groups["name"].Value
    $signature = $match.Groups["signature"].Value

    if ($signature -match '@GraphQLArgument\(name\s*=\s*"request"\)\s+(?<type>[A-Za-z0-9_]+)\s+request') {
      $requestTypes[$name] = $Matches.type
    }
  }

  return $requestTypes
}

function Get-RequestObjectSpan {
  param([Parameter(Mandatory = $true)] [string] $Query)

  $requestIndex = $Query.IndexOf("request:")
  if ($requestIndex -lt 0) {
    return $null
  }

  $openIndex = $Query.IndexOf("{", $requestIndex)
  if ($openIndex -lt 0) {
    throw "Se encontro 'request:' pero no se encontro el objeto de entrada GraphQL."
  }

  $depth = 0
  $inString = $false
  $escaped = $false

  for ($index = $openIndex; $index -lt $Query.Length; $index++) {
    $char = $Query[$index]

    if ($inString) {
      if ($escaped) {
        $escaped = $false
      } elseif ($char -eq [char]92) {
        $escaped = $true
      } elseif ($char -eq [char]34) {
        $inString = $false
      }

      continue
    }

    if ($char -eq [char]34) {
      $inString = $true
      continue
    }

    if ($char -eq [char]123) {
      $depth++
      continue
    }

    if ($char -eq [char]125) {
      $depth--

      if ($depth -eq 0) {
        return [pscustomobject]@{
          Start = $openIndex
          Length = $index - $openIndex + 1
          Text = $Query.Substring($openIndex, $index - $openIndex + 1)
        }
      }
    }
  }

  throw "No se pudo cerrar el objeto GraphQL de request."
}

function New-ParametrizedGraphQLQuery {
  param(
    [Parameter(Mandatory = $true)] [string] $OperationName,
    [Parameter(Mandatory = $true)] [string] $GraphQLQuery,
    [string[]] $BodyFieldNames = @(),
    [hashtable] $FieldDefinitions = @{}
  )

  $query = $GraphQLQuery -replace "`r`n", "`n"
  $mutationRegex = [regex]::new('^\s*mutation\s*\{', [System.Text.RegularExpressions.RegexOptions]::Singleline)

  if (-not $mutationRegex.IsMatch($query)) {
    throw "La operacion GraphQL '$OperationName' no inicia con 'mutation {'."
  }

  if ($BodyFieldNames.Count -eq 0) {
    $span = Get-RequestObjectSpan -Query $query
    if ($span) {
      throw "La operacion '$OperationName' tiene request GraphQL, pero el endpoint REST no tiene body."
    }

    return $mutationRegex.Replace($query, "mutation $OperationName {", 1)
  }

  $span = Get-RequestObjectSpan -Query $query
  if (-not $span) {
    throw "La operacion '$OperationName' tiene body REST, pero no tiene request GraphQL."
  }

  $variableDefinitions = @()
  $requestFields = @()

  foreach ($fieldName in $BodyFieldNames) {
    if (-not $FieldDefinitions.ContainsKey($fieldName)) {
      throw "El campo REST '$fieldName' no existe en el DTO GraphQL de '$OperationName'."
    }

    if ($span.Text -notmatch ("(^|[\{\s,])" + [regex]::Escape($fieldName) + "\s*:")) {
      throw "El campo REST '$fieldName' no aparece en el request GraphQL de '$OperationName'."
    }

    $variableDefinitions += ('$' + $fieldName + ': ' + $FieldDefinitions[$fieldName].GraphQLType)
    $requestFields += ($fieldName + ': $' + $fieldName)
  }

  $requestObject = "{ " + ($requestFields -join ", ") + " }"
  $query = $query.Remove($span.Start, $span.Length).Insert($span.Start, $requestObject)
  $signature = "mutation $OperationName(" + ($variableDefinitions -join ", ") + ") {"

  return $mutationRegex.Replace($query, $signature, 1)
}

$collection = Get-Content -Raw -Path $CollectionPath | ConvertFrom-Json
$requestTypeDefinitions = Get-RequestTypeDefinitions -Directory $DtoDirectory
$mutationRequestTypes = Get-MutationRequestTypes -Path $GraphQLApiPath

$restRoot = Find-CollectionItem -Items $collection.item -Name "rest"
$restOracle = Find-CollectionItem -Items $restRoot.item -Name "ORACLE"
$graphqlRoot = Find-CollectionItem -Items $collection.item -Name "graphql"
$graphqlOracle = Find-CollectionItem -Items $graphqlRoot.item -Name "Oracle"

if (-not $restOracle) {
  throw "No se encontro la carpeta rest/ORACLE en la coleccion."
}

if (-not $graphqlOracle) {
  throw "No se encontro la carpeta graphql/Oracle en la coleccion."
}

$restRequests = Get-RequestItems -Items $restOracle.item | Where-Object {
  $_.Request.method -eq "POST" -and (Get-EndpointPath -Request $_.Request).StartsWith("/api/")
}

$graphqlRequests = Get-RequestItems -Items $graphqlOracle.item | Where-Object {
  $_.Request.method -eq "POST" -and $_.Request.body.mode -eq "graphql" -and $_.Request.body.graphql.query
}

$graphqlByName = @{}
foreach ($graphqlRequest in $graphqlRequests) {
  if ($graphqlByName.ContainsKey($graphqlRequest.Name)) {
    throw "La operacion GraphQL '$($graphqlRequest.Name)' esta duplicada en graphql/Oracle."
  }

  $graphqlByName[$graphqlRequest.Name] = $graphqlRequest
}

$endpoints = @()
$missing = @()
$parametrized = 0
$withoutBody = 0

foreach ($restRequest in $restRequests) {
  $endpoint = Get-EndpointPath -Request $restRequest.Request
  $operationName = ($endpoint -split "/")[-1]
  $graphqlRequest = $graphqlByName[$operationName]

  if (-not $graphqlRequest) {
    $missing += $operationName
    continue
  }

  $restBody = Get-RestBody -Request $restRequest.Request
  $bodyFieldNames = @()
  $fieldDefinitions = @{}

  if ($restBody) {
    $bodyFieldNames = Get-JsonPropertyNames -JsonObject $restBody
    $requestTypeName = $mutationRequestTypes[$operationName]

    if (-not $requestTypeName) {
      throw "No se encontro el DTO request para la operacion GraphQL '$operationName'."
    }

    if (-not $requestTypeDefinitions.ContainsKey($requestTypeName)) {
      throw "No se encontro la definicion del DTO '$requestTypeName'."
    }

    $fieldDefinitions = $requestTypeDefinitions[$requestTypeName]
    $parametrized++
  } else {
    $withoutBody++
  }

  $graphQLQuery = New-ParametrizedGraphQLQuery `
    -OperationName $operationName `
    -GraphQLQuery $graphqlRequest.Request.body.graphql.query `
    -BodyFieldNames $bodyFieldNames `
    -FieldDefinitions $fieldDefinitions

  $endpoints += [ordered]@{
    endpoint = $endpoint
    method = $restRequest.Request.method
    output_encoding = "json"
    backend = @(
      [ordered]@{
        host = @($GraphQLHost)
        url_pattern = "/graphql"
        method = "POST"
        encoding = "json"
        extra_config = [ordered]@{
          "backend/graphql" = [ordered]@{
            type = "mutation"
            operationName = $operationName
            query = $graphQLQuery
          }
        }
      }
    )
  }
}

if ($missing.Count -gt 0) {
  throw "Faltan equivalentes GraphQL para endpoints REST: $($missing -join ', ')"
}

$config = [ordered]@{
  '$schema' = "https://www.krakend.io/schema/v3.json"
  version = 3
  name = "generate-service-graphql-rest-gateway"
  port = 8083
  timeout = "30000ms"
  cache_ttl = "300s"
  endpoints = $endpoints
}

$json = $config | ConvertTo-Json -Depth 100
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($OutputPath, $json + [Environment]::NewLine, $utf8NoBom)

Write-Host "Validado rest/ORACLE: $($restRequests.Count) endpoints."
Write-Host "Validado graphql/Oracle: $($graphqlRequests.Count) operaciones."
Write-Host "Generado $OutputPath con $($endpoints.Count) endpoints REST -> GraphQL ($parametrized con body dinamico, $withoutBody sin body)."