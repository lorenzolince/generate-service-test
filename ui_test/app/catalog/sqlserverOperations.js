import { SQLSERVER_OPERATION_DOCS } from "./sqlserverOperationDocs";

const PERSONA_SAMPLE = {
  nombre: "Valeria",
  apellido: "Rios",
  edad: 32,
  email: "valeria.rios@example.com",
  fechaNacimiento: "1994-03-15",
  activo: true
};

const PERSONA_UPDATE_SAMPLE = {
  pIdPersona: 1,
  pNombre: "Alejandro",
  pApellido: "Mendoza",
  pEdad: 36,
  pEmail: "alejandro.mendoza@test.com",
  pFechaNacimiento: "1991-02-18",
  pActivo: true
};

const PERSONA_TVP_SAMPLE = [
  {
    nombre: "Lucia",
    apellido: "Herrera",
    edad: 28,
    email: "lucia.herrera@example.com",
    fechaNacimiento: "1998-06-08",
    activo: true
  },
  {
    nombre: "Mateo",
    apellido: "Santos",
    edad: 41,
    email: "mateo.santos@example.com",
    fechaNacimiento: "1985-12-01",
    activo: false
  }
];

const PERSONAS_ID_JSON_SAMPLE = [{ idPersona: 1 }, { idPersona: 2 }];

const PERSONA_ROW_TYPE = "List<Persona>";
const SQLSERVER_JSON_TYPE = "dbo.JSON / dynamic JSON";

const responseField = (name, kind, type = "", contractType = "") => ({ name, kind, type, contractType });
const resultSet = (name, type = PERSONA_ROW_TYPE) => responseField(name, "array", type);
const scalarField = (name, type) => responseField(name, "scalar", type);
const jsonField = (name, type = SQLSERVER_JSON_TYPE) => responseField(name, "json", type, type);
const jsonRequestField = (name, type = SQLSERVER_JSON_TYPE) => ({ name, kind: "json", type: "json", contractType: type });

const jsonFormField = (name) => ({ name, type: "json" });

const operation = ({ id, label, category, body = null, responseKind = "object", responseFields = [], requestFields = null, formFields = null }) => ({
  id,
  label: label || id,
  engine: "sqlserver",
  category,
  method: "POST",
  path: `/api/${id}`,
  requestBody: body,
  hasRequestBody: body !== null,
  requestFields,
  formFields,
  responseKind,
  responseFields,
  documentation: {
    sourceType: category,
    sourceName: id,
    capabilities: [category, "post"],
    descriptionKey: id,
    ...(SQLSERVER_OPERATION_DOCS[id] || {})
  }
});

export const SQLSERVER_CATEGORIES = ["procedure", "scalarFunction", "tableFunction", "query"];

export const SQLSERVER_OPERATIONS = [
  operation({
    id: "gsSpGetPersona",
    category: "procedure",
    body: { pIdPersona: 1 },
    responseFields: [resultSet("gsSpGetPersona1", "List<GsSpGetPersona1>")]
  }),
  operation({
    id: "gsSpGetPersonas",
    category: "procedure",
    responseFields: [resultSet("gsSpGetPersonas1", "List<GsSpGetPersonas1>")]
  }),
  operation({
    id: "gsSpInsertPersona",
    category: "procedure",
    body: {
      pNombre: PERSONA_SAMPLE.nombre,
      pApellido: PERSONA_SAMPLE.apellido,
      pEdad: PERSONA_SAMPLE.edad,
      pEmail: PERSONA_SAMPLE.email,
      pFechaNacimiento: PERSONA_SAMPLE.fechaNacimiento,
      pActivo: PERSONA_SAMPLE.activo
    },
    responseFields: [resultSet("gsSpInsertPersona1", "List<GsSpInsertPersona1>")]
  }),
  operation({
    id: "gsSpUpdatePersona",
    category: "procedure",
    body: PERSONA_UPDATE_SAMPLE,
    responseFields: [resultSet("gsSpUpdatePersona1", "List<GsSpUpdatePersona1>")]
  }),
  operation({
    id: "gsSpDeletePersona",
    category: "procedure",
    body: { pIdPersona: 5 },
    responseFields: [resultSet("gsSpDeletePersona1", "List<GsSpDeletePersona1>")]
  }),
  operation({
    id: "gsSpInsertPersonas",
    category: "procedure",
    body: { pPersonas: PERSONA_TVP_SAMPLE },
    responseKind: "boolean"
  }),
  operation({
    id: "gsSpGetPersonaOut",
    category: "procedure",
    body: { pIdPersona: 1 },
    responseFields: [scalarField("pNombre", "String"), scalarField("pEdad", "int"), scalarField("pActivo", "boolean")]
  }),
  operation({
    id: "gsSpTestOut",
    category: "procedure",
    responseFields: [scalarField("pValor", "int")]
  }),
  operation({
    id: "gsSpGetPersonaJson",
    category: "procedure",
    body: { pIdPersona: 1 },
    responseFields: [jsonField("pPersona")]
  }),
  operation({
    id: "gsSpGetPersonasJson",
    category: "procedure",
    responseFields: [jsonField("pPersonas")]
  }),
  operation({
    id: "gsSpInsertPersonaJson",
    category: "procedure",
    body: {
      pNombre: PERSONA_SAMPLE.nombre,
      pApellido: PERSONA_SAMPLE.apellido,
      pEdad: PERSONA_SAMPLE.edad,
      pEmail: PERSONA_SAMPLE.email,
      pFechaNacimiento: PERSONA_SAMPLE.fechaNacimiento,
      pActivo: PERSONA_SAMPLE.activo
    },
    responseFields: [scalarField("pIdPersona", "int")]
  }),
  operation({
    id: "gsSpInsertPersonasJson",
    category: "procedure",
    body: { pPersonas: PERSONA_TVP_SAMPLE },
    responseFields: [scalarField("pInsertados", "int")]
  }),
  operation({
    id: "gsSpMultiResultPersona",
    category: "procedure",
    body: { pActivo: true },
    responseFields: [
      resultSet("gsSpMultiResultPersona1", "List<GsSpMultiResultPersona1>"),
      resultSet("gsSpMultiResultPersona2", "List<GsSpMultiResultPersona2>")
    ]
  }),
  operation({
    id: "gsFnPersonaActiva",
    category: "scalarFunction",
    body: { pIdPersona: 1 },
    responseFields: [scalarField("gsFnPersonaActivaOut", "boolean")]
  }),
  operation({
    id: "gsFnPersonaEdad",
    category: "scalarFunction",
    body: { pIdPersona: 1 },
    responseFields: [scalarField("gsFnPersonaEdadOut", "int")]
  }),
  operation({
    id: "gsFnPersonaFechaRegistro",
    category: "scalarFunction",
    body: { pIdPersona: 1 },
    responseFields: [scalarField("gsFnPersonaFechaRegistroOut", "Timestamp")]
  }),
  operation({
    id: "gsFnPersonaFechaNacimiento",
    category: "scalarFunction",
    body: { pIdPersona: 1 },
    responseFields: [scalarField("gsFnPersonaFechaNacimientoOut", "Date")]
  }),
  operation({
    id: "gsFnGetPersonaJson",
    category: "scalarFunction",
    body: { pIdPersona: 1 },
    responseFields: [jsonField("gsFnGetPersonaJsonOut")]
  }),
  operation({
    id: "gsFnGetPersonasJson",
    category: "scalarFunction",
    responseFields: [jsonField("gsFnGetPersonasJsonOut")]
  }),
  operation({
    id: "gsIfPersonasByEstado",
    category: "tableFunction",
    body: { pActivo: true },
    responseFields: [resultSet("gsIfPersonasByEstado1", "List<GsIfPersonasByEstado1>")]
  }),
  operation({
    id: "gsIfPersonasByEdad",
    category: "tableFunction",
    body: { pEdadMinima: 30 },
    responseFields: [resultSet("gsIfPersonasByEdad1", "List<GsIfPersonasByEdad1>")]
  }),
  operation({
    id: "gsIfPersonasByJson",
    category: "tableFunction",
    body: { pPersonas: PERSONAS_ID_JSON_SAMPLE },
    responseFields: [resultSet("gsIfPersonasByJson1", "List<GsIfPersonasByJson1>")]
  }),
  operation({
    id: "gsQPersonaById",
    category: "query",
    body: { idPersona: 1 },
    responseFields: [resultSet("gsQPersonaByIdquery", "List<GsQPersonaByIdQuery>")]
  }),
  operation({
    id: "gsQPersonasByNombre",
    category: "query",
    body: { nombre: "Ale" },
    responseFields: [resultSet("gsQPersonasByNombrequery", "List<GsQPersonasByNombreQuery>")]
  }),
  operation({
    id: "gsQPersonasByActivo",
    category: "query",
    body: { activo: true },
    responseFields: [resultSet("gsQPersonasByActivoquery", "List<GsQPersonasByActivoQuery>")]
  }),
  operation({
    id: "gsQPersonasSelfJoinActivo",
    category: "query",
    body: { idPersonaReferencia: 1 },
    responseFields: [resultSet("gsQPersonasSelfJoinActivoquery", "List<GsQPersonasSelfJoinActivoQuery>")]
  }),
  operation({
    id: "gsQPersonasActivasWith",
    category: "query",
    body: { activo: true },
    responseFields: [resultSet("gsQPersonasActivasWithquery", "List<GsQPersonasActivasWithQuery>")]
  }),
  operation({
    id: "gsQPersonasStatsWith",
    category: "query",
    body: { activo: true },
    responseFields: [resultSet("gsQPersonasStatsWithquery", "List<GsQPersonasStatsWithQuery>")]
  }),
  operation({
    id: "gsQPersonasByJson",
    category: "query",
    body: { personasJson: PERSONAS_ID_JSON_SAMPLE },
    responseFields: [resultSet("gsQPersonasByJsonquery", "List<GsQPersonasByJsonQuery>")]
  }),
  operation({
    id: "gsQPersonasForJson",
    category: "query",
    body: { activo: true },
    responseFields: [resultSet("gsQPersonasForJsonquery", "List<GsQPersonasForJsonQuery>")]
  }),
  operation({
    id: "gsQInsertPersona",
    category: "query",
    body: PERSONA_SAMPLE,
    responseKind: "boolean"
  }),
  operation({
    id: "gsQInsertPersonaSelect",
    category: "query",
    body: {
      nombre: "Replica",
      email: "replica@example.com",
      activo: true,
      idPersonaBase: 1
    },
    responseKind: "boolean"
  }),
  operation({
    id: "gsQUpdatePersona",
    category: "query",
    body: {
      ...PERSONA_SAMPLE,
      nombre: "Valeria SQL",
      idPersona: 1
    },
    responseKind: "boolean"
  }),
  operation({
    id: "gsQDeletePersona",
    category: "query",
    body: { idPersona: 6 },
    responseKind: "boolean"
  })
];

export const findSqlServerOperation = (operationId) => {
  const operationMatch = SQLSERVER_OPERATIONS.find((operationItem) => operationItem.id === operationId);

  if (!operationMatch) {
    throw new Error(`Unknown SQL Server operation: ${operationId}`);
  }

  return operationMatch;
};