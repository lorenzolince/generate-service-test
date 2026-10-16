-- graphql-raw.lua
--
-- Construye el payload GraphQL (query + variables) usando el BODY ORIGINAL
-- del cliente como texto crudo, sin decodificarlo nunca a una tabla/mapa.
-- Esto preserva EXACTAMENTE el orden de las llaves tal como llegaron,
-- evitando el reordenamiento alfabético que hace Go al serializar mapas.
--
-- Requisito de diseño: el body que manda el cliente debe ser directamente
-- el objeto "variables" de la mutación/query GraphQL (sin envoltorios extra).
--
-- Uso (en el "pre" de modifier/lua-backend):
--   graphql_raw_request('mutation Foo($x: Int!) { foo(x: $x) { bar } }')

function graphql_raw_request(query)
    local r = request.load()
    local original_body = r:body()

    if original_body == nil or original_body == '' then
        original_body = '{}'
    end

    -- Escapamos la query para poder incrustarla como valor string de un JSON
    local escaped_query = query:gsub('\\', '\\\\')
    escaped_query = escaped_query:gsub('"', '\\"')
    escaped_query = escaped_query:gsub('\n', ' ')
    escaped_query = escaped_query:gsub('\r', ' ')

    -- El body original (ya es JSON válido) se inserta TAL CUAL, como texto,
    -- directamente como el valor de "variables" -> preserva el orden 100%.
    local new_body = '{"query":"' .. escaped_query .. '","variables":' .. original_body .. '}'

    r:method('POST')
    r:headers('Content-Type', 'application/json')
    r:body(new_body)
end

-- fix-pnumeros-strings.lua
--
-- El .proto declara "repeated string pNumeros", pero es más natural para el
-- cliente de la API mandar numeros como numeros JSON (7, 14, 21) en vez de
-- strings ("7", "14", "21"). Este script convierte cada elemento del array
-- "pNumeros" a string ANTES de mandar la peticion al backend (Envoy/gRPC),
-- para que protojson no la rechace por tipo incorrecto.
--
-- Trabaja sobre el body como texto crudo (no requiere cjson).

function fix_pnumeros_strings()
    local r = request.load()
    local body = r:body()

    if body == nil or body == '' then
        return
    end

    body = body:gsub('"pNumeros"%s*:%s*%[([^%]]*)%]', function(inner)
        local parts = {}
        for token in (inner .. ','):gmatch('([^,]*),') do
            local trimmed = token:match('^%s*(.-)%s*$')
            if trimmed == '' then
                -- ignora entradas vacias (array vacio, o comas colgantes)
            elseif trimmed:sub(1, 1) == '"' then
                -- ya viene como string, no lo tocamos
                table.insert(parts, trimmed)
            else
                table.insert(parts, '"' .. trimmed .. '"')
            end
        end
        return '"pNumeros":[' .. table.concat(parts, ',') .. ']'
    end)

    r:body(body)
end
-- fix-scalar-to-string.lua
--
-- Convierte el valor de UN campo escalar especifico de number a string,
-- sin tocar el resto del body. Reutilizable: se le pasa el nombre del
-- campo como argumento.
--
-- Uso: fix_scalar_to_string('pIdPersona')
--
-- Ej: {"pIdPersona": 41}  ->  {"pIdPersona": "41"}

function fix_scalar_to_string(field_name)
    local r = request.load()
    local body = r:body()

    if body == nil or body == '' then
        return
    end

    -- Solo reemplaza si el valor NO esta ya entre comillas (evita doble-comillado)
    body = body:gsub(
        '"' .. field_name .. '"%s*:%s*(%-?%d+%.?%d*)',
        '"' .. field_name .. '":"%1"'
    )

    r:body(body)
end

-- fix-dates-input.lua
--
-- Convierte fechas "planas" a los formatos que protojson exige para campos
-- TIPADOS como google.type.Date / google.protobuf.Timestamp.
--
-- USAR SOLO en endpoints donde el campo de fecha es un tipo fijo del .proto
-- (ej: GsPersonaObj.fechaNacimiento). NO USAR donde el campo sea un
-- google.protobuf.Struct/Json de paso libre (ej: pEntrada), porque ahi las
-- fechas deben viajar exactamente como las mando el cliente.

function fix_dates_input()
    local r = request.load()
    local body = r:body()

    if body == nil or body == '' then
        return
    end

    -- 1) datetime completo -> RFC-3339 (Timestamp)
    body = body:gsub(
        '"(%d%d%d%d%-%d%d%-%d%d) (%d%d:%d%d:%d%d)"',
        '"%1T%2Z"'
    )

    -- 2) fecha simple -> objeto Date {year, month, day}
    body = body:gsub(
        '"(%d%d%d%d)%-(%d%d)%-(%d%d)"',
        function(y, m, d)
            return string.format('{"year":%d,"month":%d,"day":%d}', tonumber(y), tonumber(m), tonumber(d))
        end
    )

    r:body(body)
end