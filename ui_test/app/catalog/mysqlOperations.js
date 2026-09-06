import { MYSQL_OPERATION_DOCS } from "./mysqlOperationDocs";

const PERSONA_BODY = {
  pNombre: "Valeria",
  pApellido: "Rios",
  pEdad: 32,
  pEmail: "valeria.rios@example.com",
  pFechaNacimiento: "1994-03-15",
  pActivo: true
};

const PERSONA_UPDATE_BODY = {
  pIdPersona: 1,
  pNombre: "Andres",
  pApellido: "Moreno",
  pEdad: 52,
  pEmail: "andres.moreno.actualizado@test.com",
  pFechaNacimiento: "1975-03-15",
  pActivo: true
};

const QUERY_PERSONA_BODY = {
  nombre: "Valeria",
  apellido: "Rios",
  edad: 32,
  email: "valeria.rios@example.com",
  fechaNacimiento: "1994-03-15",
  activo: true
};

const QUERY_PERSONA_UPDATE_BODY = {
  ...QUERY_PERSONA_BODY,
  idPersona: 1,
  nombre: "Andres",
  email: "andres.moreno.actualizado@test.com"
};

const PERSONA_JSON_SAMPLE = {
  nombre: "Camila",
  apellido: "Paredes",
  edad: 30,
  email: "camila.paredes@example.com",
  fechaNacimiento: "1996-08-19",
  activo: true
};

const PERSONAS_JSON_SAMPLE = [
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

const EXTRA_PROFILE_SAMPLE = {
  nivel: "senior",
  habilidades: ["java", "sql", "apis"]
};

const EXTRA_BODY = {
  pIdPersona: 1,
  pSalario: 3600.75,
  pBio: "Perfil actualizado desde Generate Service.",
  pUltimoAcceso: "2026-09-01 08:15:30",
  pHoraContacto: "09:30:00",
  pFoto: "U0FNUExF",
  pPerfilNivel: EXTRA_PROFILE_SAMPLE.nivel,
  pPerfilHabilidades: EXTRA_PROFILE_SAMPLE.habilidades
};

const QUERY_EXTRA_BODY = {
  salario: 3600.75,
  bio: "Perfil actualizado desde query generada.",
  ultimoAcceso: "2026-09-01 08:15:30",
  horaContacto: "09:30:00",
  foto: "U0FNUExF",
  perfilNivel: EXTRA_PROFILE_SAMPLE.nivel,
  perfilHabilidades: EXTRA_PROFILE_SAMPLE.habilidades,
  idPersona: 1
};

const MYSQL_BOOLEAN_TYPE = "boolean / execution success";
const MYSQL_JSON_TYPE = "JSON / @RawJson natural JSON";
const MYSQL_JSON_OUT_TYPE = "JSON / @JsonRawValue natural JSON";
const MYSQL_BLOB_TYPE = "byte[] / base64";
const MYSQL_PERSONA_LIST_TYPE = "List<GsSpGetAllPersonas1>";
const MYSQL_PERSONA_QUERY_TYPE = "List<GsQPersonaByIdQuery>";

const responseField = (name, kind, type = "", contractType = "") => ({ name, kind, type, contractType });
const requestField = (name, kind, type, contractType = type) => ({ name, kind, type, contractType });
const scalarField = (name, type) => responseField(name, "scalar", type);
const arrayField = (name, type) => responseField(name, "array", type);
const jsonField = (name, type) => responseField(name, "json", type, type);
const blobField = (name, type = MYSQL_BLOB_TYPE) => responseField(name, "blob", type, type);
const scalarRequest = (name, type) => requestField(name, "scalar", type);
const jsonRequest = (name, type = MYSQL_JSON_TYPE) => requestField(name, "json", "natural JSON", type);
const arrayRequest = (name, type) => requestField(name, "array", "array", type);
const blobRequest = (name, type = MYSQL_BLOB_TYPE) => requestField(name, "blob", type, type);

const formField = (name, type = "text", col = 4) => ({ name, type, col });
const jsonFormField = (name) => ({ name, type: "json" });
const arrayFormField = (name) => ({ name, type: "array" });

const pInsertFormFields = [
  formField("pNombre"),
  formField("pApellido"),
  formField("pEdad", "number"),
  formField("pEmail", "email"),
  formField("pFechaNacimiento", "date"),
  formField("pActivo", "checkbox")
];

const pUpdateFormFields = [formField("pIdPersona", "number"), ...pInsertFormFields];

const queryInsertFormFields = [
  formField("nombre"),
  formField("apellido"),
  formField("edad", "number"),
  formField("email", "email"),
  formField("fechaNacimiento", "date"),
  formField("activo", "checkbox")
];

const queryUpdateFormFields = [...queryInsertFormFields, formField("idPersona", "number")];

const pExtraFormFields = [
  formField("pIdPersona", "number"),
  formField("pSalario", "number"),
  formField("pBio", "text", 8),
  formField("pUltimoAcceso"),
  formField("pHoraContacto"),
  formField("pFoto", "text", 8),
  formField("pPerfilNivel"),
  arrayFormField("pPerfilHabilidades")
];

const queryExtraFormFields = [
  formField("salario", "number"),
  formField("bio", "text", 8),
  formField("ultimoAcceso"),
  formField("horaContacto"),
  formField("foto", "text", 8),
  formField("perfilNivel"),
  arrayFormField("perfilHabilidades"),
  formField("idPersona", "number")
];

const pInsertRequestFields = [
  scalarRequest("pNombre", "String / VARCHAR(100)"),
  scalarRequest("pApellido", "String / VARCHAR(100)"),
  scalarRequest("pEdad", "int / INT"),
  scalarRequest("pEmail", "String / VARCHAR(150)"),
  scalarRequest("pFechaNacimiento", "Date / DATE"),
  scalarRequest("pActivo", "boolean / BOOLEAN")
];

const pUpdateRequestFields = [scalarRequest("pIdPersona", "int / INT"), ...pInsertRequestFields];

const queryInsertRequestFields = [
  scalarRequest("nombre", "String / VARCHAR(100)"),
  scalarRequest("apellido", "String / VARCHAR(100)"),
  scalarRequest("edad", "int / INT"),
  scalarRequest("email", "String / VARCHAR(150)"),
  scalarRequest("fechaNacimiento", "Date / DATE"),
  scalarRequest("activo", "boolean / BOOLEAN")
];

const queryUpdateRequestFields = [...queryInsertRequestFields, scalarRequest("idPersona", "int / INT")];

const pExtraRequestFields = [
  scalarRequest("pIdPersona", "int / INT"),
  scalarRequest("pSalario", "BigDecimal / DECIMAL(12,2)"),
  scalarRequest("pBio", "String / TEXT"),
  scalarRequest("pUltimoAcceso", "Timestamp / TIMESTAMP"),
  scalarRequest("pHoraContacto", "String / TIME"),
  blobRequest("pFoto"),
  scalarRequest("pPerfilNivel", "String / JSON.nivel"),
  arrayRequest("pPerfilHabilidades", "JSON array / JSON.habilidades")
];

const queryExtraRequestFields = [
  scalarRequest("salario", "BigDecimal / DECIMAL(12,2)"),
  scalarRequest("bio", "String / TEXT"),
  scalarRequest("ultimoAcceso", "Timestamp / TIMESTAMP"),
  scalarRequest("horaContacto", "String / TIME"),
  blobRequest("foto"),
  scalarRequest("perfilNivel", "String / JSON.nivel"),
  arrayRequest("perfilHabilidades", "JSON array / JSON.habilidades"),
  scalarRequest("idPersona", "int / INT")
];

const operation = ({ id, category, body = null, responseKind = "object", responseFields = [], requestFields = null, formFields = null }) => ({
  id,
  label: id,
  engine: "mysql",
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
    ...(MYSQL_OPERATION_DOCS[id] || {})
  }
});

export const MYSQL_CATEGORIES = ["procedure", "function", "query"];

export const MYSQL_OPERATIONS = [
  operation({
    id: "gsSpGetAllPersonas",
    category: "procedure",
    responseFields: [arrayField("gsSpGetAllPersonas1", MYSQL_PERSONA_LIST_TYPE)]
  }),
  operation({
    id: "gsSpGetPersona",
    category: "procedure",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [arrayField("gsSpGetPersona1", "List<GsSpGetPersona1>")]
  }),
  operation({
    id: "gsSpGetPersonasByEstado",
    category: "procedure",
    body: { pActivo: true },
    requestFields: [scalarRequest("pActivo", "boolean / BOOLEAN")],
    formFields: [formField("pActivo", "checkbox")],
    responseFields: [arrayField("gsSpGetPersonasByEstado1", "List<GsSpGetPersonasByEstado1>")]
  }),
  operation({
    id: "gsSpInsertPersona",
    category: "procedure",
    body: PERSONA_BODY,
    responseKind: "boolean",
    requestFields: pInsertRequestFields,
    formFields: pInsertFormFields,
    responseFields: [scalarField("response", MYSQL_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsSpUpdatePersona",
    category: "procedure",
    body: PERSONA_UPDATE_BODY,
    responseKind: "boolean",
    requestFields: pUpdateRequestFields,
    formFields: pUpdateFormFields,
    responseFields: [scalarField("response", MYSQL_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsSpInsertSelectPersona",
    category: "procedure",
    body: PERSONA_BODY,
    requestFields: pInsertRequestFields,
    formFields: pInsertFormFields,
    responseFields: [arrayField("gsSpInsertSelectPersona1", "List<GsSpInsertSelectPersona1>")]
  }),
  operation({
    id: "gsSpUpdateSelectPersona",
    category: "procedure",
    body: PERSONA_UPDATE_BODY,
    requestFields: pUpdateRequestFields,
    formFields: pUpdateFormFields,
    responseFields: [arrayField("gsSpUpdateSelectPersona1", "List<GsSpUpdateSelectPersona1>")]
  }),
  operation({
    id: "gsSpMultiResultPersona",
    category: "procedure",
    body: { pActivo: true },
    requestFields: [scalarRequest("pActivo", "boolean / BOOLEAN")],
    formFields: [formField("pActivo", "checkbox")],
    responseFields: [
      arrayField("gsSpMultiResultPersona1", "List<GsSpMultiResultPersona1>"),
      arrayField("gsSpMultiResultPersona2", "List<GsSpMultiResultPersona2>")
    ]
  }),
  operation({
    id: "gsSpMultiOperationPersona",
    category: "procedure",
    body: PERSONA_BODY,
    requestFields: pInsertRequestFields,
    formFields: pInsertFormFields,
    responseFields: [arrayField("gsSpMultiOperationPersona1", "List<GsSpMultiOperationPersona1>")]
  }),
  operation({
    id: "gsSpInsertPersonaJson",
    category: "procedure",
    body: {
      pNombre: PERSONA_JSON_SAMPLE.nombre,
      pApellido: PERSONA_JSON_SAMPLE.apellido,
      pEdad: PERSONA_JSON_SAMPLE.edad,
      pEmail: PERSONA_JSON_SAMPLE.email,
      pFechaNacimiento: PERSONA_JSON_SAMPLE.fechaNacimiento,
      pActivo: PERSONA_JSON_SAMPLE.activo
    },
    responseKind: "boolean",
    requestFields: pInsertRequestFields,
    formFields: pInsertFormFields,
    responseFields: [scalarField("response", MYSQL_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsSpInsertPersonasJsonArray",
    category: "procedure",
    body: { pPersonas: PERSONAS_JSON_SAMPLE },
    responseKind: "boolean",
    requestFields: [arrayRequest("pPersonas", "JSON array / @RawJson natural JSON")],
    formFields: [arrayFormField("pPersonas")],
    responseFields: [scalarField("response", MYSQL_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsSpGetPersonaJson",
    category: "procedure",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [jsonField("pPersona", MYSQL_JSON_OUT_TYPE)]
  }),
  operation({
    id: "gsSpGetPersonasJsonArray",
    category: "procedure",
    body: { pActivo: true },
    requestFields: [scalarRequest("pActivo", "boolean / BOOLEAN")],
    formFields: [formField("pActivo", "checkbox")],
    responseFields: [jsonField("pPersonas", MYSQL_JSON_OUT_TYPE)]
  }),
  operation({
    id: "gsSpInsertJsonResultset",
    category: "procedure",
    body: {
      pNombre: PERSONA_JSON_SAMPLE.nombre,
      pApellido: PERSONA_JSON_SAMPLE.apellido,
      pEdad: PERSONA_JSON_SAMPLE.edad,
      pEmail: PERSONA_JSON_SAMPLE.email,
      pFechaNacimiento: PERSONA_JSON_SAMPLE.fechaNacimiento,
      pActivo: PERSONA_JSON_SAMPLE.activo
    },
    requestFields: pInsertRequestFields,
    formFields: pInsertFormFields,
    responseFields: [
      arrayField("gsSpInsertJsonResultset1", "List<GsSpInsertJsonResultset1>"),
      arrayField("gsSpInsertJsonResultset2", "List<GsSpInsertJsonResultset2>")
    ]
  }),
  operation({
    id: "gsSpCountPersonasOut",
    category: "procedure",
    responseFields: [scalarField("pTotal", "int / INT")]
  }),
  operation({
    id: "gsSpGetPersonaResumenOut",
    category: "procedure",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [
      scalarField("pNombreCompleto", "String / VARCHAR(250)"),
      scalarField("pEdad", "int / INT"),
      scalarField("pActivo", "boolean / BOOLEAN"),
      scalarField("pFechaRegistro", "Timestamp / DATETIME")
    ]
  }),
  operation({
    id: "gsSpGetMysqlTiposExtraOut",
    category: "procedure",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [
      scalarField("pSalario", "BigDecimal / DECIMAL(12,2)"),
      scalarField("pBio", "String / TEXT"),
      scalarField("pUltimoAcceso", "Timestamp / TIMESTAMP"),
      scalarField("pHoraContacto", "String / TIME"),
      blobField("pFoto"),
      jsonField("pPerfilJson", MYSQL_JSON_OUT_TYPE)
    ]
  }),
  operation({
    id: "gsSpIncrementarEdadInout",
    category: "procedure",
    body: { pEdad: 32 },
    requestFields: [scalarRequest("pEdad", "int / INT")],
    formFields: [formField("pEdad", "number")],
    responseFields: [scalarField("pEdad", "int / INT")]
  }),
  operation({
    id: "gsSpNormalizarEmailInout",
    category: "procedure",
    body: { pEmail: "  ANDRES.MORENO@TEST.COM  " },
    requestFields: [scalarRequest("pEmail", "String / VARCHAR(150)")],
    formFields: [formField("pEmail", "email")],
    responseFields: [scalarField("pEmail", "String / VARCHAR(150)")]
  }),
  operation({
    id: "gsSpInsertPersonaOutId",
    category: "procedure",
    body: PERSONA_BODY,
    requestFields: pInsertRequestFields,
    formFields: pInsertFormFields,
    responseFields: [scalarField("pIdPersona", "int / INT")]
  }),
  operation({
    id: "gsSpUpdatePersonaOutCount",
    category: "procedure",
    body: PERSONA_UPDATE_BODY,
    requestFields: pUpdateRequestFields,
    formFields: pUpdateFormFields,
    responseFields: [scalarField("pFilasAfectadas", "int / INT")]
  }),
  operation({
    id: "gsSpInsertPersonaOutResultset",
    category: "procedure",
    body: PERSONA_BODY,
    requestFields: pInsertRequestFields,
    formFields: pInsertFormFields,
    responseFields: [
      scalarField("pIdPersona", "int / INT"),
      arrayField("gsSpInsertPersonaOutResultset1", "List<GsSpInsertPersonaOutResultset1>")
    ]
  }),
  operation({
    id: "gsSpGetPersonaRequired",
    category: "procedure",
    body: { pIdPersona: 1 },
    responseKind: "boolean",
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [scalarField("response", MYSQL_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsSpUpdateMysqlTiposExtra",
    category: "procedure",
    body: EXTRA_BODY,
    requestFields: pExtraRequestFields,
    formFields: pExtraFormFields,
    responseFields: [scalarField("pFilasAfectadas", "int / INT")]
  }),
  operation({
    id: "gsFnDeletePersona",
    category: "function",
    body: { pIdPersona: 5 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [scalarField("gsFnDeletePersonaOut", "int / INT")]
  }),
  operation({
    id: "fnPersonaJson",
    category: "function",
    body: { pId: 1 },
    requestFields: [scalarRequest("pId", "int / INT")],
    formFields: [formField("pId", "number")],
    responseFields: [jsonField("fnPersonaJsonOut", MYSQL_JSON_OUT_TYPE)]
  }),
  operation({
    id: "gsFnGetPersonaNombre",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [scalarField("gsFnGetPersonaNombreOut", "String / VARCHAR(250)")]
  }),
  operation({
    id: "gsFnGetPersonaFechaNacimiento",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [scalarField("gsFnGetPersonaFechaNacimientoOut", "Date / DATE")]
  }),
  operation({
    id: "gsFnGetPersonaFechaRegistro",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [scalarField("gsFnGetPersonaFechaRegistroOut", "Timestamp / DATETIME")]
  }),
  operation({
    id: "gsFnGetMysqlTiposExtraSalario",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [scalarField("gsFnGetMysqlTiposExtraSalarioOut", "BigDecimal / DECIMAL(12,2)")]
  }),
  operation({
    id: "gsFnGetMysqlTiposExtraHoraContacto",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [scalarField("gsFnGetMysqlTiposExtraHoraContactoOut", "String / TIME")]
  }),
  operation({
    id: "gsFnGetMysqlTiposExtraBio",
    category: "function",
    body: { pIdPersona: 1 },
    requestFields: [scalarRequest("pIdPersona", "int / INT")],
    formFields: [formField("pIdPersona", "number")],
    responseFields: [scalarField("gsFnGetMysqlTiposExtraBioOut", "String / TEXT")]
  }),
  operation({
    id: "gsFnCountPersonas",
    category: "function",
    responseFields: [scalarField("gsFnCountPersonasOut", "int / INT")]
  }),
  operation({
    id: "gsFnInsertPersonasJson",
    category: "function",
    body: { pPersonas: PERSONAS_JSON_SAMPLE },
    requestFields: [arrayRequest("pPersonas", "JSON array / @RawJson natural JSON")],
    formFields: [arrayFormField("pPersonas")],
    responseFields: [scalarField("gsFnInsertPersonasJsonOut", "int / INT")]
  }),
  operation({
    id: "gsFnUpdatePersona",
    category: "function",
    body: PERSONA_UPDATE_BODY,
    requestFields: pUpdateRequestFields,
    formFields: pUpdateFormFields,
    responseFields: [scalarField("gsFnUpdatePersonaOut", "boolean / BOOLEAN")]
  }),
  operation({
    id: "gsQPersonaById",
    category: "query",
    body: { idPersona: 1 },
    requestFields: [scalarRequest("idPersona", "int / INT")],
    formFields: [formField("idPersona", "number")],
    responseFields: [arrayField("gsQPersonaByIdquery", MYSQL_PERSONA_QUERY_TYPE)]
  }),
  operation({
    id: "gsQMysqlTiposExtraByPersona",
    category: "query",
    body: { idPersona: 1 },
    requestFields: [scalarRequest("idPersona", "int / INT")],
    formFields: [formField("idPersona", "number")],
    responseFields: [arrayField("gsQMysqlTiposExtraByPersonaquery", "List<GsQMysqlTiposExtraByPersonaQuery>")]
  }),
  operation({
    id: "gsQPersonasByNombre",
    category: "query",
    body: { nombre: "And" },
    requestFields: [scalarRequest("nombre", "String / VARCHAR(100)")],
    formFields: [formField("nombre")],
    responseFields: [arrayField("gsQPersonasByNombrequery", "List<GsQPersonasByNombreQuery>")]
  }),
  operation({
    id: "gsQPersonasByActivo",
    category: "query",
    body: { activo: true },
    requestFields: [scalarRequest("activo", "boolean / BOOLEAN")],
    formFields: [formField("activo", "checkbox")],
    responseFields: [arrayField("gsQPersonasByActivoquery", "List<GsQPersonasByActivoQuery>")]
  }),
  operation({
    id: "gsQPersonasSelfJoinActivo",
    category: "query",
    body: { idPersonaReferencia: 1 },
    requestFields: [scalarRequest("idPersonaReferencia", "int / INT")],
    formFields: [formField("idPersonaReferencia", "number")],
    responseFields: [arrayField("gsQPersonasSelfJoinActivoquery", "List<GsQPersonasSelfJoinActivoQuery>")]
  }),
  operation({
    id: "gsQPersonasActivasWith",
    category: "query",
    body: { activo: true },
    requestFields: [scalarRequest("activo", "boolean / BOOLEAN")],
    formFields: [formField("activo", "checkbox")],
    responseFields: [arrayField("gsQPersonasActivasWithquery", "List<GsQPersonasActivasWithQuery>")]
  }),
  operation({
    id: "gsQPersonasStatsExtraWith",
    category: "query",
    body: { activo: true },
    requestFields: [scalarRequest("activo", "boolean / BOOLEAN")],
    formFields: [formField("activo", "checkbox")],
    responseFields: [arrayField("gsQPersonasStatsExtraWithquery", "List<GsQPersonasStatsExtraWithQuery>")]
  }),
  operation({
    id: "gsQMysqlTiposExtraByPerfilJson",
    category: "query",
    body: { nivel: "senior" },
    requestFields: [scalarRequest("nivel", "String / JSON path value")],
    formFields: [formField("nivel")],
    responseFields: [arrayField("gsQMysqlTiposExtraByPerfilJsonquery", "List<GsQMysqlTiposExtraByPerfilJsonQuery>")]
  }),
  operation({
    id: "gsQInsertPersona",
    category: "query",
    body: QUERY_PERSONA_BODY,
    responseKind: "boolean",
    requestFields: queryInsertRequestFields,
    formFields: queryInsertFormFields,
    responseFields: [scalarField("response", MYSQL_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsQInsertPersonaSelect",
    category: "query",
    body: { nombre: "Copia", email: "copia.sql@example.com", activo: true, idPersonaBase: 1 },
    responseKind: "boolean",
    requestFields: [
      scalarRequest("nombre", "String / VARCHAR(100)"),
      scalarRequest("email", "String / VARCHAR(150)"),
      scalarRequest("activo", "boolean / BOOLEAN"),
      scalarRequest("idPersonaBase", "int / INT")
    ],
    formFields: [formField("nombre"), formField("email", "email"), formField("activo", "checkbox"), formField("idPersonaBase", "number")],
    responseFields: [scalarField("response", MYSQL_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsQUpdatePersona",
    category: "query",
    body: QUERY_PERSONA_UPDATE_BODY,
    responseKind: "boolean",
    requestFields: queryUpdateRequestFields,
    formFields: queryUpdateFormFields,
    responseFields: [scalarField("response", MYSQL_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsQUpdateMysqlTiposExtra",
    category: "query",
    body: QUERY_EXTRA_BODY,
    responseKind: "boolean",
    requestFields: queryExtraRequestFields,
    formFields: queryExtraFormFields,
    responseFields: [scalarField("response", MYSQL_BOOLEAN_TYPE)]
  }),
  operation({
    id: "gsQDeletePersona",
    category: "query",
    body: { idPersona: 5 },
    responseKind: "boolean",
    requestFields: [scalarRequest("idPersona", "int / INT")],
    formFields: [formField("idPersona", "number")],
    responseFields: [scalarField("response", MYSQL_BOOLEAN_TYPE)]
  })
];

export const findMysqlOperation = (id) => MYSQL_OPERATIONS.find((operationItem) => operationItem.id === id);
