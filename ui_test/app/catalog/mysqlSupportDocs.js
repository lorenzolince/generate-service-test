export const MYSQL_SUPPORT_CATEGORY = "support";

export const MYSQL_JSON_WORKFLOW = [
  {
    key: "nativeJson",
    tags: ["JSON", "JSON_TABLE", "JSON_EXTRACT"],
    example: `CREATE PROCEDURE GS_SP_INSERT_PERSONA_JSON
(
    IN P_PERSONA JSON
)`
  },
  {
    key: "jsonOperators",
    tags: ["JSON_UNQUOTE", "JSON_OBJECT", "JSON_ARRAYAGG"],
    example: `VALUES
(
    JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.nombre')),
    CAST(JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.edad')) AS UNSIGNED),
    CASE LOWER(JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.activo')))
      WHEN 'true' THEN TRUE
      WHEN '1' THEN TRUE
      ELSE FALSE
    END
)`
  },
  {
    key: "javaRaw",
    tags: ["@RawJson", "@JsonRawValue", "String"],
    example: `public class GsSpInsertPersonaJsonRequest {
    @RawJson
    private String pPersona;
}

public class GsSpGetPersonaJsonResponse {
    @JsonRawValue
    private String pPersona;
}`
  },
  {
    key: "naturalRest",
    tags: ["REST", "natural JSON"],
    example: `{
  "pPersona": {
    "nombre": "Valeria",
    "edad": 32,
    "activo": true
  }
}`
  }
];

export const MYSQL_SUPPORT_CAPABILITIES = [
  {
    key: "procedures",
    tags: ["PROCEDURE", "IN", "OUT", "INOUT"],
    example: `CREATE PROCEDURE GS_SP_GET_PERSONA_RESUMEN_OUT
(
    IN P_ID_PERSONA INT,
    OUT P_NOMBRE_COMPLETO VARCHAR(250),
    OUT P_EDAD INT,
    OUT P_ACTIVO BOOLEAN,
    OUT P_FECHA_REGISTRO DATETIME
)`
  },
  {
    key: "functions",
    tags: ["FUNCTION", "RETURNS"],
    example: `CREATE FUNCTION GS_FN_UPDATE_PERSONA
(
    P_ID_PERSONA INT,
    P_NOMBRE VARCHAR(100)
)
RETURNS BOOLEAN`
  },
  {
    key: "queries",
    tags: ["QUERY", "WITH", "JOIN"],
    example: `WITH PERSONAS_FILTRADAS AS (
    SELECT P.ID_PERSONA, P.EDAD, E.SALARIO
    FROM GS_PERSONA P
    LEFT JOIN GS_MYSQL_TIPOS_EXTRA E ON E.ID_PERSONA = P.ID_PERSONA
    WHERE P.ACTIVO = :activo
)
SELECT COUNT(*) AS total_personas, COALESCE(SUM(SALARIO), 0) AS salario_total
FROM PERSONAS_FILTRADAS`
  },
  {
    key: "resultSets",
    tags: ["SELECT", "row DTO list", "OUT_TABLE"],
    example: `CREATE PROCEDURE GS_SP_MULTI_RESULT_PERSONA
(
    IN P_ACTIVO BOOLEAN
)
BEGIN
    SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre FROM GS_PERSONA;
    SELECT COUNT(*) AS total_personas FROM GS_PERSONA;
END`
  },
  {
    key: "jsonTypes",
    tags: ["JSON", "raw JSON"],
    example: `CREATE PROCEDURE GS_SP_GET_PERSONAS_JSON_ARRAY
(
    IN P_ACTIVO BOOLEAN,
    OUT P_PERSONAS JSON
)`
  },
  {
    key: "extraTypes",
    tags: ["DECIMAL", "TEXT", "TIME", "VARBINARY"],
    example: `CREATE TABLE GS_MYSQL_TIPOS_EXTRA (
    SALARIO DECIMAL(12,2),
    BIO TEXT,
    HORA_CONTACTO TIME,
    FOTO VARBINARY(255),
    PERFIL_JSON JSON
)`
  },
  {
    key: "dmlQueries",
    tags: ["INSERT", "UPDATE", "DELETE", "boolean"],
    example: `UPDATE GS_MYSQL_TIPOS_EXTRA
SET SALARIO = :salario, PERFIL_JSON = :perfil_json
WHERE ID_PERSONA = :id_persona;`
  },
  {
    key: "errors",
    tags: ["SIGNAL", "SQLSTATE"],
    example: `SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Persona no encontrada';`
  }
];

export const MYSQL_TYPE_MAPPINGS = [
  { sqlType: "VARCHAR, CHAR, TEXT, TIME, SET(...)", contractType: "String", listType: "scalar String field", restShape: "string" },
  { sqlType: "JSON", contractType: "String + @RawJson/@JsonRawValue", listType: "raw JSON field; arrays only inside JSON", restShape: "raw JSON object/array" },
  { sqlType: "INT, INTEGER, TINYINT", contractType: "int", listType: "scalar numeric field", restShape: "number" },
  { sqlType: "BIGINT", contractType: "long", listType: "scalar numeric field", restShape: "number" },
  { sqlType: "DECIMAL, NUMERIC", contractType: "BigDecimal", listType: "scalar decimal field", restShape: "number" },
  { sqlType: "BOOLEAN, BOOL", contractType: "boolean", listType: "scalar boolean field", restShape: "boolean" },
  { sqlType: "DATE", contractType: "Date", listType: "scalar date field", restShape: "string date" },
  { sqlType: "DATETIME, TIMESTAMP", contractType: "Timestamp", listType: "scalar date-time field", restShape: "string date-time" },
  { sqlType: "VARBINARY", contractType: "byte[]", listType: "scalar binary field", restShape: "base64 string" }
];

export const MYSQL_RULE_GROUPS = [
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
