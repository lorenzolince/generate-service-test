import { POSTGRES_OPERATION_DOCS } from "./postgresOperationDocs";

const PERSONA_SAMPLE = {
  idPersona: 0,
  nombre: "Valeria",
  apellido: "Rios",
  edad: 32,
  email: "valeria.rios@example.com",
  fechaNacimiento: "1994-03-15",
  activo: true,
  fechaRegistro: "2024-01-01 09:00:00"
};

const PERSONA_UPDATE_SAMPLE = {
  ...PERSONA_SAMPLE,
  idPersona: 1,
  nombre: "Alejandro",
  apellido: "Mendoza",
  edad: 36,
  email: "alejandro.mendoza@test.com",
  fechaNacimiento: "1991-02-18"
};

const PERSONAS_SAMPLE = [
  {
    ...PERSONA_SAMPLE,
    nombre: "Lucia",
    apellido: "Herrera",
    edad: 28,
    email: "lucia.herrera@example.com",
    fechaNacimiento: "1998-06-08"
  },
  {
    ...PERSONA_SAMPLE,
    nombre: "Mateo",
    apellido: "Santos",
    edad: 41,
    email: "mateo.santos@example.com",
    fechaNacimiento: "1985-12-01",
    activo: false
  }
];

const PERSONA_JSON_SAMPLE = {
  nombre: "Camila",
  apellido: "Paredes",
  edad: 30,
  email: "camila.paredes@example.com",
  fechaNacimiento: "1996-08-19",
  activo: true
};

const PERSONA_JSON_SAVE_SAMPLE = {
  idPersona: "",
  ...PERSONA_JSON_SAMPLE
};

const PERSONA_JSON_UPDATE_SAMPLE = {
  idPersona: 1,
  nombre: "Alejandro",
  apellido: "Mendoza",
  edad: 37,
  email: "alejandro.mendoza@test.com",
  fechaNacimiento: "1991-02-18",
  activo: true
};

const PERSONA_JSON_OBJ_SAMPLE = {
  idPersona: 0,
  nombre: "Natalia",
  datos: {
    apellido: "Rojas",
    edad: 31,
    email: "natalia.rojas@example.com",
    fechaNacimiento: "1995-05-12",
    activo: true
  }
};

const PERSONA_CURSOR_SAMPLE = [
  {
    idPersona: 21,
    nombre: "Cursor",
    apellido: "Prueba",
    edad: 34,
    email: "cursor.prueba@example.com",
    fechaNacimiento: "1992-04-10",
    activo: true,
    fechaRegistro: "2024-01-01 10:00:00"
  }
];

const PERSONA_OBJECT_TYPE = "GsPersonaObj";
const PERSONA_ARRAY_TYPE = "GsPersonaObjArray<GsPersonaObj>";
const PERSONA_ROW_TYPE = "List<GsPersona>";
const PERSONA_CURSOR_TYPE = "List<PCursor>";
const PERSONA_DETAIL_TYPE = "GsPersonaDetalleObj";
const PERSONA_DETAIL_ARRAY_TYPE = "GsPersonaDetalleObjArray<GsPersonaDetalleObj>";
const QUERY_PERSONA_TYPE = "List<GsQPersonaByIdQuery>";
const QUERY_PERSONAS_BY_ACTIVO_TYPE = "List<GsQPersonasByActivoQuery>";
const QUERY_PERSONAS_SELF_JOIN_TYPE = "List<GsQPersonasSelfJoinActivoQuery>";
const QUERY_PERSONAS_ACTIVAS_WITH_TYPE = "List<GsQPersonasActivasWithQuery>";
const QUERY_PERSONAS_TOTAL_HIJOS_TYPE = "List<GsQPersonasTotalHijosWithQuery>";
const QUERY_PERSONAS_STATS_TYPE = "List<GsQPersonasStatsWithQuery>";
const QUERY_PERSONAS_CITY_TYPE = "List<GsQPersonasByCityJoinQuery>";
const QUERY_PERSONAS_JSON_RESULT_TYPE = "List<GsQPersonasByJsonQuery>";
const QUERY_PERSONAS_AS_JSON_TYPE = "List<GsQPersonasAsJsonQuery>";
const QUERY_BOOLEAN_TYPE = "boolean / execution success";
const POSTGRES_JSON_TYPE = "JSON / @RawJson natural JSON";
const POSTGRES_JSONB_TYPE = "JSONB / @RawJson natural JSON";

const responseField = (name, kind, type = "", contractType = "") => ({ name, kind, type, contractType });
const requestField = (name, kind, type, contractType = type) => ({ name, kind, type, contractType });
const scalarField = (name, type) => responseField(name, "scalar", type);
const objectField = (name, type) => responseField(name, "object", type);
const arrayField = (name, type) => responseField(name, "array", type);
const jsonField = (name, type) => responseField(name, "json", type, type);
const scalarRequest = (name, type) => requestField(name, "scalar", type);
const objectRequest = (name, type) => requestField(name, "object", type);
const arrayRequest = (name, type) => requestField(name, "array", type);
const jsonRequest = (name, type) => requestField(name, "json", "natural JSON", type);

const operation = ({ id, label, category, body = null, responseKind = "object", responseFields = [], requestFields = null }) => ({
  id,
  label: label || id,
  engine: "postgres",
  category,
  method: "POST",
  path: `/api/${id}`,
  requestBody: body,
  hasRequestBody: body !== null,
  requestFields,
  responseKind,
  responseFields,
  documentation: {
    sourceType: category,
    sourceName: id,
    capabilities: [category, "post"],
    descriptionKey: id,
    ...(POSTGRES_OPERATION_DOCS[id] || {})
  }
});

export const POSTGRES_CATEGORIES = ["procedure", "function", "setReturningFunction", "query"];

export const POSTGRES_OPERATIONS = [
  operation({
    id: "gsSpGetPersona",
    category: "procedure",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseFields: [objectField("pPersona", PERSONA_OBJECT_TYPE)]
  }),
  operation({
    id: "gsSpGetPersonas",
    category: "procedure",
    responseFields: [arrayField("pPersonas", PERSONA_ARRAY_TYPE)]
  }),
  operation({
    id: "gsSpInsertPersona",
    category: "procedure",
    body: { pPersona: PERSONA_SAMPLE },
    requestFields: [objectRequest("pPersona", PERSONA_OBJECT_TYPE)],
    responseFields: [scalarField("pIdPersona", "int / INTEGER")]
  }),
  operation({
    id: "gsSpInsertPersonas",
    category: "procedure",
    body: { pPersonas: PERSONAS_SAMPLE },
    requestFields: [arrayRequest("pPersonas", PERSONA_ARRAY_TYPE)],
    responseFields: [scalarField("pInsertados", "int / INTEGER")]
  }),
  operation({
    id: "gsSpUpdatePersona",
    category: "procedure",
    body: { pPersona: PERSONA_UPDATE_SAMPLE },
    requestFields: [objectRequest("pPersona", PERSONA_OBJECT_TYPE)],
    responseFields: [scalarField("pActualizado", "boolean / BOOLEAN")]
  }),
  operation({
    id: "gsSpDeletePersona",
    category: "procedure",
    body: { pIdPersona: 5 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseFields: [scalarField("pEliminado", "boolean / BOOLEAN")]
  }),
  operation({
    id: "gsSpSavePersonaJsonbInout",
    category: "procedure",
    body: { pPersona: PERSONA_JSON_SAVE_SAMPLE },
    requestFields: [jsonRequest("pPersona", POSTGRES_JSONB_TYPE)],
    responseFields: [jsonField("pPersona", "JSONB / @JsonRawValue")]
  }),
  operation({
    id: "gsSpResumenPersonas",
    category: "procedure",
    responseFields: [scalarField("pTotal", "int / INTEGER"), scalarField("pActivos", "int / INTEGER"), scalarField("pInactivos", "int / INTEGER")]
  }),
  operation({
    id: "gsSpGetPersonaDetalle",
    category: "procedure",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseFields: [objectField("pPersona", PERSONA_DETAIL_TYPE)]
  }),
  operation({
    id: "gsSpGetPersonasDetalle",
    category: "procedure",
    responseFields: [arrayField("pPersonas", PERSONA_DETAIL_ARRAY_TYPE)]
  }),
  operation({
    id: "gsSpGetPersonasCursorOut",
    category: "procedure",
    body: { pActivo: true },
    requestFields: [scalarRequest("pActivo", "boolean / BOOLEAN")],
    responseFields: [arrayField("pCursor", PERSONA_CURSOR_TYPE)]
  }),
  operation({
    id: "gsSpGetPersonasCursorInout",
    category: "procedure",
    body: { pActivo: true, pCursor: PERSONA_CURSOR_SAMPLE },
    requestFields: [scalarRequest("pActivo", "boolean / BOOLEAN"), arrayRequest("pCursor", PERSONA_CURSOR_TYPE)],
    responseFields: [arrayField("pCursor", PERSONA_CURSOR_TYPE)]
  }),
  operation({
    id: "gsSpResumenPersonasOut",
    category: "procedure",
    responseFields: [scalarField("pTotal", "int / INTEGER"), scalarField("pActivos", "int / INTEGER"), scalarField("pInactivos", "int / INTEGER"), scalarField("pTieneInactivos", "boolean / BOOLEAN")]
  }),
  operation({
    id: "gsSpInsertarPersonasCursor",
    category: "procedure",
    body: { pCursor: PERSONA_CURSOR_SAMPLE },
    requestFields: [jsonRequest("pCursor", "REFCURSOR / @RawJson natural array")],
    responseFields: [scalarField("pTotalProcesados", "int / INTEGER")]
  }),
  operation({
    id: "gsSpGetPersonasEstadoCursor",
    category: "procedure",
    responseFields: [arrayField("pCursorActivos", "List<PCursorActivos>"), arrayField("pCursorInactivos", "List<PCursorInactivos>")]
  }),
  operation({
    id: "gsSpGetPersonaJson",
    category: "procedure",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseFields: [jsonField("pPersona", "JSON / @JsonRawValue")]
  }),
  operation({
    id: "gsSpInsertPersonaJson",
    category: "procedure",
    body: { pPersona: PERSONA_JSON_SAMPLE },
    requestFields: [jsonRequest("pPersona", POSTGRES_JSON_TYPE)],
    responseFields: [scalarField("pIdPersona", "int / INTEGER")]
  }),
  operation({
    id: "gsSpUpdatePersonaJson",
    category: "procedure",
    body: { pPersona: PERSONA_JSON_UPDATE_SAMPLE },
    requestFields: [jsonRequest("pPersona", POSTGRES_JSON_TYPE)],
    responseFields: [scalarField("pActualizado", "boolean / BOOLEAN")]
  }),
  operation({
    id: "gsSpSavePersonaJsonInout",
    category: "procedure",
    body: { pPersona: PERSONA_JSON_SAVE_SAMPLE },
    requestFields: [jsonRequest("pPersona", POSTGRES_JSON_TYPE)],
    responseFields: [jsonField("pPersona", "JSON / @JsonRawValue")]
  }),
  operation({
    id: "gsSpGetPersonaJsonb",
    category: "procedure",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseFields: [jsonField("pPersona", "JSONB / @JsonRawValue")]
  }),
  operation({
    id: "gsSpInsertPersonaJsonb",
    category: "procedure",
    body: { pPersona: PERSONA_JSON_SAMPLE },
    requestFields: [jsonRequest("pPersona", POSTGRES_JSONB_TYPE)],
    responseFields: [scalarField("pIdPersona", "int / INTEGER")]
  }),
  operation({
    id: "gsSpUpdatePersonaJsonb",
    category: "procedure",
    body: { pPersona: PERSONA_JSON_UPDATE_SAMPLE },
    requestFields: [jsonRequest("pPersona", POSTGRES_JSONB_TYPE)],
    responseFields: [scalarField("pActualizado", "boolean / BOOLEAN")]
  }),
  operation({
    id: "gsSpIncrementarEdad",
    category: "procedure",
    body: { pEdad: 31 },
    requestFields: [scalarRequest("pEdad", "int / INTEGER INOUT")],
    responseFields: [scalarField("pEdad", "int / INTEGER")]
  }),
  operation({
    id: "gsFnGetPersonaRow",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseFields: [objectField("gsFnGetPersonaRow", "GsPersona")]
  }),
  operation({
    id: "gsFnGetPersonaObj",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseFields: [objectField("gsFnGetPersonaObj", PERSONA_OBJECT_TYPE)]
  }),
  operation({
    id: "gsFnGetPersonaJsonObj",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseFields: [objectField("gsFnGetPersonaJsonObj", "GsPersonaJsonObj")]
  }),
  operation({
    id: "gsFnSavePersonaJsonObj",
    category: "function",
    body: { pPersona: PERSONA_JSON_OBJ_SAMPLE },
    requestFields: [objectRequest("pPersona", "GsPersonaJsonObj(datos JSONB raw)")],
    responseFields: [scalarField("gsFnSavePersonaJsonObj", "boolean / BOOLEAN")]
  }),
  operation({
    id: "gsFnResumenPersonas",
    category: "function",
    responseFields: [scalarField("total", "int / INTEGER"), scalarField("activos", "int / INTEGER"), scalarField("inactivos", "int / INTEGER")]
  }),
  operation({
    id: "gsFnBuscarPersona",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseFields: [objectField("gsFnBuscarPersona", "GsPersona")]
  }),
  operation({
    id: "gsFnTouchPersonaVoid",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseKind: "boolean"
  }),
  operation({
    id: "gsFnInsertPersonaThenError",
    category: "function",
    body: { pNombre: "Rollback", pApellido: "Controlado" },
    requestFields: [scalarRequest("pNombre", "String / VARCHAR"), scalarRequest("pApellido", "String / VARCHAR")],
    responseKind: "boolean"
  }),
  operation({
    id: "gsFnErrorControlado",
    category: "function",
    responseFields: [scalarField("gsFnErrorControlado", "boolean / BOOLEAN")]
  }),
  operation({
    id: "gsFnIncrementarEdadInout",
    category: "function",
    body: { pEdad: 31 },
    requestFields: [scalarRequest("pEdad", "int / INTEGER INOUT")],
    responseFields: [scalarField("pEdad", "int / INTEGER")]
  }),
  operation({
    id: "gsFnResumenInout",
    category: "function",
    body: { pTotal: 0, pActivos: 0, pInactivos: 0 },
    requestFields: [scalarRequest("pTotal", "int / INTEGER INOUT"), scalarRequest("pActivos", "int / INTEGER INOUT"), scalarRequest("pInactivos", "int / INTEGER INOUT")],
    responseFields: [scalarField("pTotal", "int / INTEGER"), scalarField("pActivos", "int / INTEGER"), scalarField("pInactivos", "int / INTEGER")]
  }),
  operation({
    id: "gsFnResumenMixto",
    category: "function",
    body: { pTotal: 0 },
    requestFields: [scalarRequest("pTotal", "int / INTEGER INOUT")],
    responseFields: [scalarField("pTotal", "int / INTEGER"), scalarField("pActivos", "int / INTEGER"), scalarField("pInactivos", "int / INTEGER")]
  }),
  operation({
    id: "gsFnGetPersonasTable",
    category: "setReturningFunction",
    body: { pActivo: true },
    requestFields: [scalarRequest("pActivo", "boolean / BOOLEAN")],
    responseFields: [arrayField("gsFnGetPersonasTableOut", "List<GsFnGetPersonasTableOut>")]
  }),
  operation({
    id: "gsFnGetPersonasSetof",
    category: "setReturningFunction",
    body: { pActivo: true },
    requestFields: [scalarRequest("pActivo", "boolean / BOOLEAN")],
    responseFields: [arrayField("gsFnGetPersonasSetof", PERSONA_ROW_TYPE)]
  }),
  operation({
    id: "gsFnGetPersonasNombresSetof",
    category: "setReturningFunction",
    body: { pActivo: true },
    requestFields: [scalarRequest("pActivo", "boolean / BOOLEAN")],
    responseFields: [arrayField("gsFnGetPersonasNombresSetof", "List<String>")]
  }),
  operation({
    id: "gsFnGetPersonasJsonSetof",
    category: "setReturningFunction",
    responseFields: [arrayField("gsFnGetPersonasJsonSetof", "List<JSON> / @JsonRawValue")]
  }),
  operation({
    id: "gsFnGetPersonasJsonbSetof",
    category: "setReturningFunction",
    responseFields: [arrayField("gsFnGetPersonasJsonbSetof", "List<JSONB> / @JsonRawValue")]
  }),
  operation({
    id: "gsFnGetPersonasPorEstado",
    category: "setReturningFunction",
    body: { pActivo: true },
    requestFields: [scalarRequest("pActivo", "boolean / BOOLEAN")],
    responseFields: [arrayField("gsFnGetPersonasPorEstado", PERSONA_ROW_TYPE)]
  }),
  operation({
    id: "gsFnGetPersonasPorIds",
    category: "setReturningFunction",
    body: { pIds: [1, 2, 3] },
    requestFields: [arrayRequest("pIds", "List<Integer> / INTEGER[]")],
    responseFields: [arrayField("gsFnGetPersonasPorIds", PERSONA_ROW_TYPE)]
  }),
  operation({
    id: "gsFnGetPersonaNullable",
    category: "setReturningFunction",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INTEGER")],
    responseFields: [arrayField("gsFnGetPersonaNullableOut", "List<GsFnGetPersonaNullableOut>")]
  }),
  operation({
    id: "gsQPersonaById",
    category: "query",
    body: { idPersona: 1 },
    requestFields: [scalarRequest("idPersona", "int / INTEGER")],
    responseFields: [arrayField("gsQPersonaById", QUERY_PERSONA_TYPE)]
  }),
  operation({
    id: "gsQPersonasByNombre",
    category: "query",
    body: { nombre: "Alejandro" },
    requestFields: [scalarRequest("nombre", "String / VARCHAR")],
    responseFields: [arrayField("gsQPersonasByNombre", "List<GsQPersonasByNombreQuery>")]
  }),
  operation({
    id: "gsQPersonasByActivo",
    category: "query",
    body: { activo: true },
    requestFields: [scalarRequest("activo", "boolean / BOOLEAN")],
    responseFields: [arrayField("gsQPersonasByActivo", QUERY_PERSONAS_BY_ACTIVO_TYPE)]
  }),
  operation({
    id: "gsQPersonasSelfJoinActivo",
    category: "query",
    body: { idPersonaReferencia: 1 },
    requestFields: [scalarRequest("idPersonaReferencia", "int / INTEGER")],
    responseFields: [arrayField("gsQPersonasSelfJoinActivo", QUERY_PERSONAS_SELF_JOIN_TYPE)]
  }),
  operation({
    id: "gsQPersonasActivasWith",
    category: "query",
    body: { activo: true },
    requestFields: [scalarRequest("activo", "boolean / BOOLEAN")],
    responseFields: [arrayField("gsQPersonasActivasWith", QUERY_PERSONAS_ACTIVAS_WITH_TYPE)]
  }),
  operation({
    id: "gsQPersonasTotalHijosWith",
    category: "query",
    body: { activo: true },
    requestFields: [scalarRequest("activo", "boolean / BOOLEAN")],
    responseFields: [arrayField("gsQPersonasTotalHijosWith", QUERY_PERSONAS_TOTAL_HIJOS_TYPE)]
  }),
  operation({
    id: "gsQPersonasStatsWith",
    category: "query",
    body: { activo: true },
    requestFields: [scalarRequest("activo", "boolean / BOOLEAN")],
    responseFields: [arrayField("gsQPersonasStatsWith", QUERY_PERSONAS_STATS_TYPE)]
  }),
  operation({
    id: "gsQPersonasByCityJoin",
    category: "query",
    body: { ciudad: "Bogota" },
    requestFields: [scalarRequest("ciudad", "String / VARCHAR")],
    responseFields: [arrayField("gsQPersonasByCityJoin", QUERY_PERSONAS_CITY_TYPE)]
  }),
  operation({
    id: "gsQPersonasByJson",
    category: "query",
    body: { personasJson: [{ idPersona: 1 }, { idPersona: 3 }, { idPersona: 10 }] },
    requestFields: [jsonRequest("personasJson", POSTGRES_JSON_TYPE)],
    responseFields: [arrayField("gsQPersonasByJson", QUERY_PERSONAS_JSON_RESULT_TYPE)]
  }),
  operation({
    id: "gsQPersonasByJsonb",
    category: "query",
    body: { personasJsonb: [{ idPersona: 1 }, { idPersona: 3 }, { idPersona: 10 }] },
    requestFields: [jsonRequest("personasJsonb", POSTGRES_JSONB_TYPE)],
    responseFields: [arrayField("gsQPersonasByJsonb", "List<GsQPersonasByJsonbQuery>")]
  }),
  operation({
    id: "gsQPersonasAsJson",
    category: "query",
    body: { activo: true },
    requestFields: [scalarRequest("activo", "boolean / BOOLEAN")],
    responseFields: [arrayField("gsQPersonasAsJson", QUERY_PERSONAS_AS_JSON_TYPE)]
  }),
  operation({
    id: "gsQPersonasAsJsonb",
    category: "query",
    body: { activo: true },
    requestFields: [scalarRequest("activo", "boolean / BOOLEAN")],
    responseFields: [arrayField("gsQPersonasAsJsonb", "List<GsQPersonasAsJsonbQuery>")]
  }),
  operation({
    id: "gsQInsertPersona",
    category: "query",
    body: {
      nombre: "Daniela",
      apellido: "Vega",
      edad: 33,
      email: "daniela.vega.postgres@test.com",
      fechaNacimiento: "1993-02-14",
      activo: true
    },
    requestFields: [scalarRequest("nombre", "String / VARCHAR"), scalarRequest("apellido", "String / VARCHAR"), scalarRequest("edad", "int / INTEGER"), scalarRequest("email", "String / VARCHAR"), scalarRequest("fechaNacimiento", "Date / DATE"), scalarRequest("activo", "boolean / BOOLEAN")],
    responseKind: "boolean",
    responseFields: [scalarField("response", QUERY_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsQInsertPersonaSelect",
    category: "query",
    body: { nombre: "Replica Postgres", email: "replica.postgres@test.com", activo: true, idPersonaBase: 1 },
    requestFields: [scalarRequest("nombre", "String / VARCHAR"), scalarRequest("email", "String / VARCHAR"), scalarRequest("activo", "boolean / BOOLEAN"), scalarRequest("idPersonaBase", "int / INTEGER")],
    responseKind: "boolean",
    responseFields: [scalarField("response", QUERY_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsQUpdatePersona",
    category: "query",
    body: {
      nombre: "Alejandro Query",
      apellido: "Mendoza",
      edad: 36,
      email: "alejandro.query.postgres@test.com",
      fechaNacimiento: "1991-02-18",
      activo: true,
      idPersona: 1
    },
    requestFields: [scalarRequest("nombre", "String / VARCHAR"), scalarRequest("apellido", "String / VARCHAR"), scalarRequest("edad", "int / INTEGER"), scalarRequest("email", "String / VARCHAR"), scalarRequest("fechaNacimiento", "Date / DATE"), scalarRequest("activo", "boolean / BOOLEAN"), scalarRequest("idPersona", "int / INTEGER")],
    responseKind: "boolean",
    responseFields: [scalarField("response", QUERY_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsQDeletePersona",
    category: "query",
    body: { idPersona: 10 },
    requestFields: [scalarRequest("idPersona", "int / INTEGER")],
    responseKind: "boolean",
    responseFields: [scalarField("response", QUERY_BOOLEAN_TYPE)]
  })
];

export const findPostgresOperation = (operationId) => {
  const operationMatch = POSTGRES_OPERATIONS.find((operationItem) => operationItem.id === operationId);

  if (!operationMatch) {
    throw new Error(`Unknown Postgres operation: ${operationId}`);
  }

  return operationMatch;
};