export const POSTGRES_SUPPORT_CATEGORY = "support";

export const POSTGRES_JSON_WORKFLOW = [
  {
    key: "nativeJson",
    tags: ["JSON", "JSONB"],
    example: `CREATE OR REPLACE PROCEDURE gs_sp_insert_persona_jsonb
(
    IN p_persona JSONB,
    OUT p_id_persona INTEGER
)`
  },
  {
    key: "jsonOperators",
    tags: ["->>", "json_build_object", "jsonb_build_object"],
    example: `VALUES
(
    p_persona ->> 'nombre',
    NULLIF(p_persona ->> 'edad', '')::INTEGER,
    COALESCE(NULLIF(p_persona ->> 'activo', '')::BOOLEAN, TRUE)
)`
  },
  {
    key: "javaRaw",
    tags: ["@RawJson", "@JsonRawValue"],
    example: `public class GsSpInsertPersonaJsonbRequest {
    @RawJson
    private String pPersona;
}

public class GsSpGetPersonaJsonbResponse {
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

export const POSTGRES_SUPPORT_CAPABILITIES = [
  {
    key: "procedures",
    tags: ["PROCEDURE", "IN", "OUT", "INOUT"],
    example: `CREATE OR REPLACE PROCEDURE gs_sp_get_persona
(
    IN p_id_persona INTEGER,
    OUT p_persona gs_persona_obj
)`
  },
  {
    key: "functions",
    tags: ["FUNCTION", "RETURNS"],
    example: `CREATE OR REPLACE FUNCTION gs_fn_get_persona_obj
(
    p_id_persona INTEGER
)
RETURNS gs_persona_obj`
  },
  {
    key: "setReturningFunctions",
    tags: ["RETURNS TABLE", "RETURNS SETOF"],
    example: `CREATE OR REPLACE FUNCTION gs_fn_get_personas_setof
(
    p_activo BOOLEAN
)
RETURNS SETOF gs_persona`
  },
  {
    key: "queries",
    tags: ["QUERY", "WITH", "JSONB"],
    example: `WITH personas_filtradas AS (
    SELECT id_persona, edad, activo
    FROM gs_persona
    WHERE activo = :activo
)
SELECT COUNT(*)::INTEGER AS total_personas
FROM personas_filtradas`
  },
  {
    key: "compositeTypes",
    tags: ["CREATE TYPE", "OBJECT"],
    example: `CREATE TYPE gs_persona_obj AS
(
    id_persona INTEGER,
    nombre VARCHAR(100),
    activo BOOLEAN
)`
  },
  {
    key: "arrays",
    tags: ["type[]", "List<T>"],
    example: `CREATE OR REPLACE PROCEDURE gs_sp_insert_personas
(
    IN p_personas gs_persona_obj[],
    OUT p_insertados INTEGER
)`
  },
  {
    key: "refcursors",
    tags: ["REFCURSOR", "List<row>"],
    example: `CREATE OR REPLACE PROCEDURE gs_sp_get_personas_cursor_out
(
    IN p_activo BOOLEAN,
    OUT p_cursor REFCURSOR
)`
  },
  {
    key: "jsonTypes",
    tags: ["JSON", "JSONB", "raw JSON"],
    example: `CREATE TYPE gs_persona_json_obj AS
(
    id_persona INTEGER,
    nombre VARCHAR(100),
    datos JSONB
)`
  },
  {
    key: "transactions",
    tags: ["VOID", "EXCEPTION"],
    example: `CREATE OR REPLACE FUNCTION gs_fn_insert_persona_then_error
(
    p_nombre VARCHAR,
    p_apellido VARCHAR
)
RETURNS VOID`
  }
];

export const POSTGRES_TYPE_MAPPINGS = [
  { sqlType: "VARCHAR, CHAR, BPCHAR, TEXT, BIT, VARBIT", contractType: "String", listType: "String / List<String>", restShape: "string" },
  { sqlType: "JSON, JSONB", contractType: "String + @RawJson/@JsonRawValue", listType: "String / List<String> raw", restShape: "raw JSON object/array" },
  { sqlType: "NUMERIC, DECIMAL, MONEY", contractType: "BigDecimal", listType: "java.math.BigDecimal / List<BigDecimal>", restShape: "number" },
  { sqlType: "BOOLEAN, BOOL", contractType: "boolean", listType: "Boolean / List<Boolean>", restShape: "boolean" },
  { sqlType: "INTEGER, INT, INT4, SERIAL", contractType: "int", listType: "Integer / List<Integer>", restShape: "number" },
  { sqlType: "BIGINT, BIGSERIAL, INT8, OID", contractType: "long", listType: "Long / List<Long>", restShape: "number" },
  { sqlType: "REAL, FLOAT4", contractType: "float", listType: "Float / List<Float>", restShape: "number" },
  { sqlType: "DOUBLE PRECISION, FLOAT8, FLOAT", contractType: "double", listType: "Double / List<Double>", restShape: "number" },
  { sqlType: "TIMESTAMP, TIMESTAMPTZ", contractType: "Timestamp", listType: "java.sql.Timestamp / List<Timestamp>", restShape: "string date-time" },
  { sqlType: "DATE", contractType: "Date", listType: "java.sql.Date / List<Date>", restShape: "string date" },
  { sqlType: "BYTEA", contractType: "byte[]", listType: "Byte[] / List<Byte[]>", restShape: "base64 string" },
  { sqlType: "Composite types, e.g. gs_persona_obj", contractType: "OBJECT / DTO", listType: "DTO", restShape: "object" },
  { sqlType: "Arrays, e.g. INTEGER[], gs_persona_obj[]", contractType: "ARRAY", listType: "List<T>", restShape: "array" },
  { sqlType: "REFCURSOR", contractType: "TypeParam.REF", listType: "List<row DTO>", restShape: "array<object>" }
];

export const POSTGRES_RULE_GROUPS = [
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