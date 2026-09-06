export const SQLSERVER_SUPPORT_CATEGORY = "support";

export const SQLSERVER_JSON_ALIAS_SOURCE = `IF TYPE_ID(N'dbo.JSON') IS NULL
    EXEC(N'CREATE TYPE dbo.JSON FROM NVARCHAR(MAX) NULL');
GO`;

export const SQLSERVER_JSON_WORKFLOW = [
  {
    key: "customAlias",
    tags: ["dbo.JSON", "NVARCHAR(MAX)"],
    example: SQLSERVER_JSON_ALIAS_SOURCE
  },
  {
    key: "openJson",
    tags: ["OPENJSON", "WITH"],
    example: `FROM OPENJSON(@P_PERSONA)
WITH
(
    NOMBRE VARCHAR(100) '$.nombre',
    EDAD INT '$.edad',
    ACTIVO BIT '$.activo'
)`
  },
  {
    key: "forJson",
    tags: ["FOR JSON PATH", "WITHOUT_ARRAY_WRAPPER"],
    example: `SELECT ID_PERSONA AS idPersona,
       NOMBRE AS nombre,
       ACTIVO AS activo
FROM dbo.GS_PERSONA
FOR JSON PATH, WITHOUT_ARRAY_WRAPPER`
  },
  {
    key: "javaRaw",
    tags: ["@RawJson", "@JsonRawValue"],
    example: `public class GsSpInsertPersonaJsonRequest {
    @RawJson
    private String pPersona;
}

public class GsSpGetPersonaJsonResponse {
    @JsonRawValue
    private String pPersona;
}`
  }
];

export const SQLSERVER_SUPPORT_CAPABILITIES = [
  {
    key: "procedures",
    tags: ["PROCEDURE", "IN", "OUT"],
    example: `CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONA_OUT
    @P_ID_PERSONA INT,
    @P_NOMBRE VARCHAR(100) OUTPUT,
    @P_ACTIVO BIT OUTPUT`
  },
  {
    key: "scalarFunctions",
    tags: ["FUNCTION", "RETURNS"],
    example: `CREATE OR ALTER FUNCTION dbo.GS_FN_PERSONA_ACTIVA (@P_ID_PERSONA INT)
RETURNS BIT`
  },
  {
    key: "tableFunctions",
    tags: ["RETURNS TABLE", "INLINE"],
    example: `CREATE OR ALTER FUNCTION dbo.GS_IF_PERSONAS_BY_ESTADO (@P_ACTIVO BIT)
RETURNS TABLE
AS
RETURN (SELECT * FROM dbo.GS_PERSONA WHERE ACTIVO = @P_ACTIVO);`
  },
  {
    key: "tableValuedParameters",
    tags: ["TYPE AS TABLE", "READONLY"],
    example: `CREATE TYPE dbo.GS_PERSONA_TYPE AS TABLE (...);

CREATE OR ALTER PROCEDURE dbo.GS_SP_INSERT_PERSONAS
    @P_PERSONAS dbo.GS_PERSONA_TYPE READONLY`
  },
  {
    key: "queries",
    tags: [":params", "SELECT"],
    example: "SELECT ID_PERSONA, NOMBRE FROM dbo.GS_PERSONA WHERE ID_PERSONA = :id_persona;"
  },
  {
    key: "dmlQueries",
    tags: ["INSERT", "UPDATE", "DELETE"],
    example: "UPDATE dbo.GS_PERSONA SET NOMBRE = :nombre WHERE ID_PERSONA = :id_persona;"
  },
  {
    key: "multiResultSets",
    tags: ["SELECT", "SELECT"],
    example: `SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre FROM dbo.GS_PERSONA;

SELECT COUNT(*) AS total_personas FROM dbo.GS_PERSONA;`
  },
  {
    key: "dynamicJson",
    tags: ["dbo.JSON", "raw JSON"],
    example: `@P_PERSONA dbo.JSON OUTPUT
RETURNS dbo.JSON`
  }
];

export const SQLSERVER_TYPE_MAPPINGS = [
  { sqlType: "CHAR, VARCHAR, NCHAR, NVARCHAR, TEXT, NTEXT", contractType: "String", listType: "String / List<String>", restShape: "string" },
  { sqlType: "dbo.JSON (NVARCHAR(MAX) alias)", contractType: "String", listType: "String / List<String>", restShape: "raw JSON object/array" },
  { sqlType: "DECIMAL, NUMERIC, MONEY, SMALLMONEY", contractType: "BigDecimal", listType: "java.math.BigDecimal / List<BigDecimal>", restShape: "number" },
  { sqlType: "BIT", contractType: "boolean", listType: "Boolean / List<Boolean>", restShape: "boolean" },
  { sqlType: "TINYINT", contractType: "int", listType: "Integer / List<Integer>", restShape: "number 0..255" },
  { sqlType: "BIGINT", contractType: "long", listType: "Long / List<Long>", restShape: "number" },
  { sqlType: "REAL", contractType: "float", listType: "Float / List<Float>", restShape: "number" },
  { sqlType: "FLOAT", contractType: "double", listType: "Double / List<Double>", restShape: "number" },
  { sqlType: "UDT AS TABLE READONLY", contractType: "ARRAY", listType: "List<DTO>", restShape: "array<object>" },
  { sqlType: "DATETIME, DATETIME2, SMALLDATETIME", contractType: "Timestamp", listType: "java.sql.Timestamp / List<Timestamp>", restShape: "string date-time" },
  { sqlType: "DATE", contractType: "Date", listType: "java.sql.Date / List<Date>", restShape: "string date" },
  { sqlType: "BINARY, VARBINARY, IMAGE", contractType: "byte[]", listType: "Byte[] / List<Byte[]>", restShape: "base64 string" },
  { sqlType: "INTEGER, INT", contractType: "int", listType: "Integer / List<Integer>", restShape: "number" }
];

export const SQLSERVER_RULE_GROUPS = [
  {
    key: "naming",
    rules: ["snakeCase", "camelCase", "endpointNames", "envOverride", "jsonProperty"]
  },
  {
    key: "integrity",
    rules: ["repositoryIntegrity", "licenseValidation", "signedMetadata", "regenerateOnSourceChange", "oneEndpointPerSource"]
  },
  {
    key: "customization",
    rules: ["controllers", "services", "businessLogic", "sourceLock"]
  }
];