export const ORACLE_SUPPORT_CATEGORY = "support";

export const ORACLE_SUPPORT_CAPABILITIES = [
  {
    key: "procedures",
    tags: ["IN", "OUT", "IN OUT"],
    example: `CREATE OR REPLACE PROCEDURE GS_SP_GET_PERSONA
(
    P_ID_PERSONA IN NUMBER,
    P_PERSONA OUT GS_PERSONA_OBJ
);`
  },
  {
    key: "functions",
    tags: ["RETURN", "OUT"],
    example: `CREATE OR REPLACE FUNCTION GS_FN_GET_PERSONA_OBJ
(
    P_ID_PERSONA IN NUMBER
)
RETURN GS_PERSONA_OBJ;`
  },
  {
    key: "packages",
    tags: ["PROCEDURE", "FUNCTION"],
    example: `PACKAGE GS_PKG_TEST
PROCEDURE GET_PERSONA
(
    P_ID_PERSONA IN NUMBER,
    P_PERSONA OUT GS_PERSONA_OBJ
);`
  },
  {
    key: "queries",
    tags: ["SELECT", "INSERT", "UPDATE", "DELETE"],
    example: "SELECT ID_PERSONA, NOMBRE, EMAIL FROM GS_PERSONA WHERE ID_PERSONA = :id_persona;"
  },
  {
    key: "pipelined",
    tags: ["PIPELINED", "TABLE"],
    example: `CREATE OR REPLACE FUNCTION GS_FN_PIPE_PERSONAS
(
    P_ACTIVO IN NUMBER DEFAULT NULL
)
RETURN GS_PERSONA_TAB PIPELINED;`
  },
  {
    key: "cursors",
    tags: ["SYS_REFCURSOR", "CURSOR IN"],
    example: `OPEN P_PERSONAS FOR
SELECT P.ID_PERSONA, P.NOMBRE, P.EMAIL
FROM GS_PERSONA P
ORDER BY P.ID_PERSONA;`
  },
  {
    key: "objectTypes",
    tags: ["OBJECT", "DTO"],
    example: `CREATE OR REPLACE TYPE GS_PERSONA_OBJ AS OBJECT
(
    ID_PERSONA NUMBER(10),
    NOMBRE VARCHAR2(100),
    EMAIL VARCHAR2(150)
);`
  },
  {
    key: "tableTypes",
    tags: ["TABLE", "ArrayList"],
    example: "CREATE OR REPLACE TYPE GS_PERSONA_TAB AS TABLE OF GS_PERSONA_OBJ;"
  },
  {
    key: "lobs",
    tags: ["CLOB", "BLOB"],
    example: `PROCEDURE GS_SP_LOB_VALUES
(
    P_TEXTO_IN IN CLOB,
    P_ARCHIVO_IN IN BLOB,
    P_TEXTO_OUT OUT CLOB,
    P_ARCHIVO_OUT OUT BLOB
);`
  }
];

export const ORACLE_TYPE_MAPPINGS = [
  { oracleType: "VARCHAR2, VARCHAR, CHAR", contractType: "String", listType: "List<String>", restShape: "string" },
  { oracleType: "CLOB", contractType: "String", listType: "List<String>", restShape: "string" },
  { oracleType: "NUMBER fallback, DECIMAL, NUMERIC", contractType: "BigDecimal", listType: "List<BigDecimal>", restShape: "number" },
  { oracleType: "INTEGER, INT", contractType: "int", listType: "List<Integer>", restShape: "number" },
  { oracleType: "FLOAT", contractType: "double", listType: "List<Double>", restShape: "number" },
  { oracleType: "NUMBER(1,0) logical BOOLEAN", contractType: "boolean", listType: "List<Boolean>", restShape: "boolean" },
  { oracleType: "TIMESTAMP", contractType: "Timestamp", listType: "List<Timestamp>", restShape: "string date-time" },
  { oracleType: "DATE", contractType: "Date", listType: "List<Date>", restShape: "string date" },
  { oracleType: "BLOB, RAW", contractType: "byte[]", listType: "List<Byte[]>", restShape: "base64 string" },
  { oracleType: "OBJECT", contractType: "DTO", listType: "List<DTO>", restShape: "object" },
  { oracleType: "TABLE OF OBJECT", contractType: "ARRAY", listType: "ArrayList<DTO>", restShape: "array<object>" },
  { oracleType: "TABLE OF simple type", contractType: "ARRAY", listType: "List<String | Integer | BigDecimal>", restShape: "array<scalar>" }
];

export const ORACLE_NUMBER_PRECISION_MAPPINGS = [
  {
    condition: "precision = 1, scale = 0",
    logicalType: "BOOLEAN",
    javaType: "boolean",
    listType: "List<Boolean>"
  },
  {
    condition: "1 < precision <= 10, scale = 0",
    logicalType: "INTEGER",
    javaType: "int",
    listType: "List<Integer>"
  },
  {
    condition: "10 < precision <= 19, scale = 0",
    logicalType: "BIGINT",
    javaType: "long",
    listType: "List<Long>"
  },
  {
    condition: "0 < precision <= 7, 0 < scale <= 4",
    logicalType: "FLOAT",
    javaType: "float",
    listType: "List<Float>"
  },
  {
    condition: "0 < precision <= 15, 0 < scale <= 8",
    logicalType: "DOUBLE",
    javaType: "Double",
    listType: "List<Double>"
  },
  {
    condition: "Otherwise",
    logicalType: "DECIMAL",
    javaType: "BigDecimal",
    listType: "List<BigDecimal>"
  }
];

export const ORACLE_RULE_GROUPS = [
  {
    key: "naming",
    rules: [
      "snakeCase",
      "camelCase",
      "endpointNames",
      "envOverride",
      "jsonProperty"
    ]
  },
  {
    key: "integrity",
    rules: [
      "repositoryIntegrity",
      "licenseValidation",
      "signedMetadata",
      "regenerateOnSourceChange",
      "oneEndpointPerSource"
    ]
  },
  {
    key: "customization",
    rules: [
      "controllers",
      "services",
      "businessLogic",
      "sourceLock"
    ]
  }
];

export const ORACLE_MODEL_EXAMPLES = [
  {
    key: "objectToDto",
    source: `CREATE TYPE GS_PERSONA_OBJ AS OBJECT
(
    ID_PERSONA NUMBER(10),
    NOMBRE VARCHAR2(100),
    EMAIL VARCHAR2(150)
);`,
    java: `public class GsPersonaObj {
    private int idPersona;
    private String nombre;
    private String email;
}`
  },
  {
    key: "tableToArray",
    source: "CREATE TYPE GS_PERSONA_TAB AS TABLE OF GS_PERSONA_OBJ;",
    java: "ArrayList<GsPersonaObj>"
  },
  {
    key: "simpleTableToList",
    source: `CREATE TYPE GS_NUMBER_TAB AS TABLE OF NUMBER;
CREATE TYPE GS_VARCHAR2_TAB AS TABLE OF VARCHAR2(100);`,
    java: `List<BigDecimal>
List<String>`
  }
];