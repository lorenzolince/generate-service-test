export const ORACLE_OPERATION_DOCS = {
  gsSpGetTwoCursors: {
    sourceType: "procedure",
    sourceName: "GS_SP_GET_TWO_CURSORS",
    capabilities: ["procedure", "refCursor", "multipleCursors"],
    source: `PROCEDURE GS_SP_GET_TWO_CURSORS
(
    P_PERSONAS OUT SYS_REFCURSOR,
    P_HIJOS OUT SYS_REFCURSOR
);`
  },
  gsSpGetPersonasCursor: {
    sourceType: "procedure",
    sourceName: "GS_SP_GET_PERSONAS_CURSOR",
    capabilities: ["procedure", "refCursor"],
    source: `PROCEDURE GS_SP_GET_PERSONAS_CURSOR
(
    P_PERSONAS OUT SYS_REFCURSOR
);`
  },
  gsSpArraysPrimitivosInout: {
    sourceType: "procedure",
    sourceName: "GS_SP_ARRAYS_PRIMITIVOS_INOUT",
    capabilities: ["procedure", "collection", "inOut"],
    source: `PROCEDURE GS_SP_ARRAYS_PRIMITIVOS_INOUT
(
    P_NUMEROS IN GS_NUMBER_TAB,
    P_TEXTOS IN OUT GS_VARCHAR2_TAB,
    P_FECHAS OUT GS_DATE_TAB,
    P_TIMESTAMPS OUT GS_TIMESTAMP_TAB,
    P_TOTAL OUT NUMBER,
    P_SUMA OUT NUMBER
);`
  },
  gsSpTypeParams: {
    sourceType: "procedure",
    sourceName: "GS_SP_TYPE_PARAMS",
    capabilities: ["procedure", "anchoredTypes", "multipleOutputs"],
    source: `PROCEDURE GS_SP_TYPE_PARAMS
(
    P_ID_PERSONA IN GS_PERSONA.ID_PERSONA%TYPE,
    P_NOMBRE OUT GS_PERSONA.NOMBRE%TYPE,
    P_EMAIL OUT GS_PERSONA.EMAIL%TYPE,
    P_ACTIVO OUT GS_PERSONA.ACTIVO%TYPE,
    P_FECHA_NACIMIENTO OUT GS_PERSONA.FECHA_NACIMIENTO%TYPE,
    P_FECHA_REGISTRO OUT GS_PERSONA.FECHA_REGISTRO%TYPE
);`
  },
  gsSpCountPersonasCursor: {
    sourceType: "procedure",
    sourceName: "GS_SP_COUNT_PERSONAS_CURSOR",
    capabilities: ["procedure", "refCursor", "cursorInput", "multipleOutputs"],
    source: `PROCEDURE GS_SP_COUNT_PERSONAS_CURSOR
(
    P_PERSONAS IN SYS_REFCURSOR,
    P_TOTAL OUT NUMBER
);`
  },
  gsSpInsertPersona: {
    sourceType: "procedure",
    sourceName: "GS_SP_INSERT_PERSONA",
    capabilities: ["procedure", "objectType", "dml", "insert"],
    source: `PROCEDURE GS_SP_INSERT_PERSONA
(
    P_PERSONA IN GS_PERSONA_OBJ,
    P_ID_PERSONA OUT NUMBER
);`
  },
  gsSpUpdatePersona: {
    sourceType: "procedure",
    sourceName: "GS_SP_UPDATE_PERSONA",
    capabilities: ["procedure", "objectType", "dml", "update"],
    source: `PROCEDURE GS_SP_UPDATE_PERSONA
(
    P_PERSONA IN GS_PERSONA_OBJ,
    P_ACTUALIZADO OUT NUMBER
);`
  },
  gsSpDeletePersona: {
    sourceType: "procedure",
    sourceName: "GS_SP_DELETE_PERSONA",
    capabilities: ["procedure", "dml", "delete"],
    source: `PROCEDURE GS_SP_DELETE_PERSONA
(
    P_ID_PERSONA IN NUMBER,
    P_ELIMINADO OUT NUMBER
);`
  },
  gsSpGetPersona: {
    sourceType: "procedure",
    sourceName: "GS_SP_GET_PERSONA",
    capabilities: ["procedure", "objectType", "multipleOutputs"],
    source: `PROCEDURE GS_SP_GET_PERSONA
(
    P_ID_PERSONA IN NUMBER,
    P_PERSONA OUT GS_PERSONA_OBJ
);`
  },
  gsSpLobValues: {
    sourceType: "procedure",
    sourceName: "GS_SP_LOB_VALUES",
    capabilities: ["procedure", "lob", "multipleOutputs"],
    source: `PROCEDURE GS_SP_LOB_VALUES
(
    P_TEXTO_IN IN CLOB,
    P_ARCHIVO_IN IN BLOB,
    P_TEXTO_OUT OUT CLOB,
    P_ARCHIVO_OUT OUT BLOB,
    P_TEXTO_LENGTH OUT NUMBER,
    P_ARCHIVO_LENGTH OUT NUMBER
);`
  },
  gsSpGetThreeCursors: {
    sourceType: "procedure",
    sourceName: "GS_SP_GET_THREE_CURSORS",
    capabilities: ["procedure", "refCursor", "multipleCursors"],
    source: `PROCEDURE GS_SP_GET_THREE_CURSORS
(
    P_PERSONAS OUT SYS_REFCURSOR,
    P_HIJOS OUT SYS_REFCURSOR,
    P_DIRECCIONES OUT SYS_REFCURSOR
);`
  },
  gsSpGetPersonasDetalle: {
    sourceType: "procedure",
    sourceName: "GS_SP_GET_PERSONAS_DETALLE",
    capabilities: ["procedure", "objectType", "collection", "nestedTypes"],
    source: `PROCEDURE GS_SP_GET_PERSONAS_DETALLE
(
    P_PERSONAS OUT GS_PERSONA_DETALLE_TAB
);`
  },
  gsSpCursorInWithOutputs: {
    sourceType: "procedure",
    sourceName: "GS_SP_CURSOR_IN_WITH_OUTPUTS",
    capabilities: ["procedure", "refCursor", "cursorInput", "multipleOutputs"],
    source: `PROCEDURE GS_SP_CURSOR_IN_WITH_OUTPUTS
(
    P_ENTRADA IN SYS_REFCURSOR,
    P_TOTAL OUT NUMBER,
    P_PERSONAS OUT SYS_REFCURSOR
);`
  },
  gsSpLobCursor: {
    sourceType: "procedure",
    sourceName: "GS_SP_LOB_CURSOR",
    capabilities: ["procedure", "lob", "refCursor"],
    source: `PROCEDURE GS_SP_LOB_CURSOR
(
    P_LOBS OUT SYS_REFCURSOR
);`
  },
  gsSpArraysPrimitivosOut: {
    sourceType: "procedure",
    sourceName: "GS_SP_ARRAYS_PRIMITIVOS_OUT",
    capabilities: ["procedure", "collection", "multipleOutputs"],
    source: `PROCEDURE GS_SP_ARRAYS_PRIMITIVOS_OUT
(
    P_NUMEROS OUT GS_NUMBER_TAB,
    P_ENTEROS OUT GS_INTEGER_TAB,
    P_BOOLEANOS OUT GS_BOOLEAN_TAB,
    P_TEXTOS OUT GS_VARCHAR2_TAB,
    P_FECHAS OUT GS_DATE_TAB,
    P_TIMESTAMPS OUT GS_TIMESTAMP_TAB
);`
  },
  gsSpCursorOutNoMetadata: {
    sourceType: "procedure",
    sourceName: "GS_SP_CURSOR_OUT_NO_METADATA",
    capabilities: ["procedure", "refCursor", "metadataFallback"],
    source: `PROCEDURE GS_SP_CURSOR_OUT_NO_METADATA
(
    P_ABRIR_CURSOR IN NUMBER DEFAULT 0,
    P_PERSONAS OUT SYS_REFCURSOR,
    P_TOTAL OUT NUMBER,
    P_MENSAJE OUT VARCHAR2
);`
  },
  gsSpLobInout: {
    sourceType: "procedure",
    sourceName: "GS_SP_LOB_INOUT",
    capabilities: ["procedure", "lob", "inOut"],
    source: `PROCEDURE GS_SP_LOB_INOUT
(
    P_TEXTO IN OUT CLOB,
    P_ARCHIVO IN OUT BLOB,
    P_TEXTO_LENGTH OUT NUMBER,
    P_ARCHIVO_LENGTH OUT NUMBER
);`
  },
  gsSpGetPersonas: {
    sourceType: "procedure",
    sourceName: "GS_SP_GET_PERSONAS",
    capabilities: ["procedure", "objectType", "collection"],
    source: `PROCEDURE GS_SP_GET_PERSONAS
(
    P_PERSONAS OUT GS_PERSONA_TAB
);`
  },
  gsSpGetPersonaDetalle: {
    sourceType: "procedure",
    sourceName: "GS_SP_GET_PERSONA_DETALLE",
    capabilities: ["procedure", "objectType", "nestedTypes"],
    source: `PROCEDURE GS_SP_GET_PERSONA_DETALLE
(
    P_ID_PERSONA IN NUMBER,
    P_PERSONA OUT GS_PERSONA_DETALLE_OBJ
);`
  },
  gsSpCursorInoutPersonas: {
    sourceType: "procedure",
    sourceName: "GS_SP_CURSOR_INOUT_PERSONAS",
    capabilities: ["procedure", "refCursor", "cursorInput", "inOut"],
    source: `PROCEDURE GS_SP_CURSOR_INOUT_PERSONAS
(
    P_PERSONAS IN OUT SYS_REFCURSOR,
    P_TOTAL OUT NUMBER
);`
  },
  gsFnCountPersonas: {
    sourceType: "function",
    sourceName: "GS_FN_COUNT_PERSONAS",
    capabilities: ["function", "scalarReturn"],
    source: "FUNCTION GS_FN_COUNT_PERSONAS RETURN NUMBER;"
  },
  gsFnTypeNombre: {
    sourceType: "function",
    sourceName: "GS_FN_TYPE_NOMBRE",
    capabilities: ["function", "scalarReturn", "anchoredTypes"],
    source: `FUNCTION GS_FN_TYPE_NOMBRE
(
    P_ID_PERSONA IN GS_PERSONA.ID_PERSONA%TYPE
)
RETURN GS_PERSONA.NOMBRE%TYPE;`
  },
  gsFnPipePersonas: {
    sourceType: "function",
    sourceName: "GS_FN_PIPE_PERSONAS",
    capabilities: ["function", "collection", "pipelined"],
    source: `FUNCTION GS_FN_PIPE_PERSONAS
(
    P_ACTIVO IN NUMBER DEFAULT NULL
)
RETURN GS_PERSONA_TAB PIPELINED;`
  },
  gsFnGetPersonasTab: {
    sourceType: "function",
    sourceName: "GS_FN_GET_PERSONAS_TAB",
    capabilities: ["function", "objectType", "collection"],
    source: "FUNCTION GS_FN_GET_PERSONAS_TAB RETURN GS_PERSONA_TAB;"
  },
  gsFnCursorInoutPersonas: {
    sourceType: "function",
    sourceName: "GS_FN_CURSOR_INOUT_PERSONAS",
    capabilities: ["function", "refCursor", "cursorInput", "inOut", "scalarReturn"],
    source: `FUNCTION GS_FN_CURSOR_INOUT_PERSONAS
(
    P_PERSONAS IN OUT SYS_REFCURSOR
)
RETURN NUMBER;`
  },
  gsFnCursorReturnWithOut: {
    sourceType: "function",
    sourceName: "GS_FN_CURSOR_RETURN_WITH_OUT",
    capabilities: ["function", "refCursor", "multipleOutputs"],
    source: `FUNCTION GS_FN_CURSOR_RETURN_WITH_OUT
(
    P_ACTIVO IN NUMBER,
    P_TOTAL OUT NUMBER
)
RETURN SYS_REFCURSOR;`
  },
  gsFnGetPersonasCursor: {
    sourceType: "function",
    sourceName: "GS_FN_GET_PERSONAS_CURSOR",
    capabilities: ["function", "refCursor"],
    source: "FUNCTION GS_FN_GET_PERSONAS_CURSOR RETURN SYS_REFCURSOR;"
  },
  gsFnCursorInCount: {
    sourceType: "function",
    sourceName: "GS_FN_CURSOR_IN_COUNT",
    capabilities: ["function", "refCursor", "cursorInput", "scalarReturn"],
    source: `FUNCTION GS_FN_CURSOR_IN_COUNT
(
    P_PERSONAS IN SYS_REFCURSOR
)
RETURN NUMBER;`
  },
  gsFnGetPersonaObj: {
    sourceType: "function",
    sourceName: "GS_FN_GET_PERSONA_OBJ",
    capabilities: ["function", "objectType"],
    source: `FUNCTION GS_FN_GET_PERSONA_OBJ
(
    P_ID_PERSONA IN NUMBER
)
RETURN GS_PERSONA_OBJ;`
  },
  fnCountPersonas: {
    sourceType: "package",
    sourceName: "GS_PKG_TEST.FN_COUNT_PERSONAS",
    capabilities: ["package", "function", "scalarReturn"],
    source: `PACKAGE GS_PKG_TEST
FUNCTION FN_COUNT_PERSONAS RETURN NUMBER;`
  },
  pipePersonas: {
    sourceType: "package",
    sourceName: "GS_PKG_TEST.PIPE_PERSONAS",
    capabilities: ["package", "function", "collection", "pipelined"],
    source: `PACKAGE GS_PKG_TEST
FUNCTION PIPE_PERSONAS
(
    P_ACTIVO IN NUMBER DEFAULT NULL
)
RETURN GS_PERSONA_TAB PIPELINED;`
  },
  getPersonasCursor: {
    sourceType: "package",
    sourceName: "GS_PKG_TEST.GET_PERSONAS_CURSOR",
    capabilities: ["package", "procedure", "refCursor"],
    source: `PACKAGE GS_PKG_TEST
PROCEDURE GET_PERSONAS_CURSOR
(
    P_PERSONAS OUT SYS_REFCURSOR
);`
  },
  getPersona: {
    sourceType: "package",
    sourceName: "GS_PKG_TEST.GET_PERSONA",
    capabilities: ["package", "procedure", "objectType"],
    source: `PACKAGE GS_PKG_TEST
PROCEDURE GET_PERSONA
(
    P_ID_PERSONA IN NUMBER,
    P_PERSONA OUT GS_PERSONA_OBJ
);`
  },
  fnGetPersonasCursor: {
    sourceType: "package",
    sourceName: "GS_PKG_TEST.FN_GET_PERSONAS_CURSOR",
    capabilities: ["package", "function", "refCursor"],
    source: `PACKAGE GS_PKG_TEST
FUNCTION FN_GET_PERSONAS_CURSOR RETURN SYS_REFCURSOR;`
  },
  arraysPrimitivosInout: {
    sourceType: "package",
    sourceName: "GS_PKG_TEST.ARRAYS_PRIMITIVOS_INOUT",
    capabilities: ["package", "procedure", "collection", "inOut"],
    source: `PACKAGE GS_PKG_TEST
PROCEDURE ARRAYS_PRIMITIVOS_INOUT
(
    P_NUMEROS IN GS_NUMBER_TAB,
    P_TEXTOS IN OUT GS_VARCHAR2_TAB,
    P_FECHAS OUT GS_DATE_TAB,
    P_TIMESTAMPS OUT GS_TIMESTAMP_TAB,
    P_TOTAL OUT NUMBER,
    P_SUMA OUT NUMBER
);`
  },
  cursorInWithOutputs: {
    sourceType: "package",
    sourceName: "GS_PKG_TEST.CURSOR_IN_WITH_OUTPUTS",
    capabilities: ["package", "procedure", "refCursor", "cursorInput", "multipleOutputs"],
    source: `PACKAGE GS_PKG_TEST
PROCEDURE CURSOR_IN_WITH_OUTPUTS
(
    P_ENTRADA IN SYS_REFCURSOR,
    P_TOTAL OUT NUMBER,
    P_PERSONAS OUT SYS_REFCURSOR
);`
  },
  gsQUpdatePersonass: {
    sourceType: "query",
    sourceName: "GS_Q_UPDATE_PERSONASS",
    capabilities: ["query", "dml", "update"],
    source: "UPDATE GS_PERSONA SET NOMBRE = :nombre, APELLIDO = :apellido, EDAD = :edad, EMAIL = :email, FECHA_NACIMIENTO = :fecha_nacimiento, ACTIVO = :activo WHERE ID_PERSONA = :id_persona;"
  },
  gsQPersonasTotalHijosWith: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_TOTAL_HIJOS_WITH",
    capabilities: ["query", "select", "withClause", "join", "aggregate"],
    source: "WITH HIJOS_POR_PERSONA AS (SELECT ID_PERSONA, COUNT(1) AS TOTAL_HIJOS FROM GS_HIJO GROUP BY ID_PERSONA) SELECT P.ID_PERSONA, P.NOMBRE, P.APELLIDO, P.ACTIVO, CAST(NVL(H.TOTAL_HIJOS, 0) AS NUMBER(10)) AS TOTAL_HIJOS FROM GS_PERSONA P LEFT JOIN HIJOS_POR_PERSONA H ON H.ID_PERSONA = P.ID_PERSONA WHERE P.ACTIVO = :activo ORDER BY P.ID_PERSONA;"
  },
  gsQDeletePersona: {
    sourceType: "query",
    sourceName: "GS_Q_DELETE_PERSONA",
    capabilities: ["query", "dml", "delete"],
    source: "DELETE FROM GS_PERSONA WHERE ID_PERSONA = :id_persona;"
  },
  gsQPersonasActivasWith: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_ACTIVAS_WITH",
    capabilities: ["query", "select", "withClause"],
    source: "WITH PERSONAS_FILTRADAS AS (SELECT ID_PERSONA, NOMBRE, APELLIDO, ACTIVO FROM GS_PERSONA WHERE ACTIVO = :activo) SELECT ID_PERSONA, NOMBRE, APELLIDO, ACTIVO FROM PERSONAS_FILTRADAS ORDER BY ID_PERSONA;"
  },
  gsQPersonasByCityJoinss: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_BY_CITY_JOINSS",
    capabilities: ["query", "select", "join"],
    source: "SELECT P.ID_PERSONA, P.NOMBRE, P.APELLIDO, D.PAIS, D.CIUDAD, D.TELEFONO FROM GS_PERSONA P JOIN GS_PERSONA_DIRECCION D ON D.ID_PERSONA = P.ID_PERSONA WHERE D.CIUDAD = :ciudad;"
  },
  gsQInsertPersonaSelect: {
    sourceType: "query",
    sourceName: "GS_Q_INSERT_PERSONA_SELECT",
    capabilities: ["query", "dml", "insert", "insertSelect"],
    source: "INSERT INTO GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO) SELECT :nombre, P.APELLIDO, P.EDAD, :email, P.FECHA_NACIMIENTO, :activo FROM GS_PERSONA P WHERE P.ID_PERSONA = :id_persona_base;"
  },
  gsQPersonaByNombre: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONA_BY_NOMBRE",
    capabilities: ["query", "select"],
    source: "SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO FROM GS_PERSONA WHERE NOMBRE = :nombre;"
  },
  gsQPersonaById: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONA_BY_ID",
    capabilities: ["query", "select"],
    source: "SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO FROM GS_PERSONA WHERE ID_PERSONA = :id_persona;"
  },
  gsQInsertPersona: {
    sourceType: "query",
    sourceName: "GS_Q_INSERT_PERSONA",
    capabilities: ["query", "dml", "insert"],
    source: "INSERT INTO GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO) VALUES (:nombre, :apellido, :edad, :email, :fecha_nacimiento, :activo);"
  }
};