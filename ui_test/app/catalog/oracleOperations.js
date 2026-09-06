import { ORACLE_OPERATION_DOCS } from "./oracleOperationDocs";

const PERSONA_SAMPLE = {
  idPersona: 0,
  nombre: "Natalia",
  apellido: "Prieto",
  edad: 31,
  email: "natalia.prieto@example.com",
  fechaNacimiento: "1995-04-12",
  activo: true,
  fechaRegistro: "2026-09-01 12:30:00"
};

const PERSONA_CURSOR_SAMPLE = [
  {
    idPersona: 2,
    nombre: "Ana",
    apellido: "Torres",
    edad: 34,
    email: "ana.torres@example.com",
    fechaNacimiento: "1992-03-18",
    activo: true,
    fechaRegistro: "2026-09-01 08:10:00"
  },
  {
    idPersona: 5,
    nombre: "Bruno",
    apellido: "Castillo",
    edad: 41,
    email: "bruno.castillo@example.com",
    fechaNacimiento: "1985-11-07",
    activo: false,
    fechaRegistro: "2026-09-01 08:25:00"
  }
];

const responseField = (name, kind, type = "") => ({ name, kind, type });

const operation = ({ id, label, category, body = null, responseKind = "object", responseFields = [] }) => ({
  id,
  label: label || id,
  engine: "oracle",
  category,
  method: "POST",
  path: `/api/${id}`,
  requestBody: body,
  hasRequestBody: body !== null,
  responseKind,
  responseFields,
  documentation: {
    sourceType: category,
    sourceName: id,
    capabilities: [category],
    descriptionKey: id,
    ...(ORACLE_OPERATION_DOCS[id] || {})
  }
});

export const ORACLE_CATEGORIES = ["procedure", "function", "package", "query"];

export const ORACLE_OPERATIONS = [
  operation({
    id: "gsSpGetTwoCursors",
    category: "procedure",
    responseFields: [responseField("pPersonas", "array", "List<PPersonas>"), responseField("pHijos", "array", "List<PHijos>")]
  }),
  operation({
    id: "gsSpGetPersonasCursor",
    category: "procedure",
    responseFields: [responseField("pPersonas", "array", "List<PPersonas>")]
  }),
  operation({
    id: "gsSpArraysPrimitivosInout",
    category: "procedure",
    body: { pNumeros: [7, 14, 21, 28], pTextos: ["norte", "sur", "oriente"] },
    responseFields: [
      responseField("pTextos", "array"),
      responseField("pFechas", "array"),
      responseField("pTimestamps", "array"),
      responseField("pTotal", "scalar"),
      responseField("pSuma", "scalar")
    ]
  }),
  operation({
    id: "gsSpTypeParams",
    category: "procedure",
    body: { pIdPersona: 3 },
    responseFields: [
      responseField("pNombre", "scalar"),
      responseField("pEmail", "scalar"),
      responseField("pActivo", "scalar"),
      responseField("pFechaNacimiento", "scalar"),
      responseField("pFechaRegistro", "scalar")
    ]
  }),
  operation({
    id: "gsSpCountPersonasCursor",
    category: "procedure",
    body: { pPersonas: PERSONA_CURSOR_SAMPLE },
    responseFields: [responseField("pTotal", "scalar")]
  }),
  operation({
    id: "gsSpInsertPersona",
    category: "procedure",
    body: { pPersona: PERSONA_SAMPLE },
    responseFields: [responseField("pIdPersona", "scalar", "BigDecimal")]
  }),
  operation({
    id: "gsSpUpdatePersona",
    category: "procedure",
    body: { pPersona: { ...PERSONA_SAMPLE, idPersona: 7, nombre: "Renata", apellido: "Ortiz", activo: false } },
    responseFields: [responseField("pActualizado", "scalar", "BigDecimal")]
  }),
  operation({
    id: "gsSpDeletePersona",
    category: "procedure",
    body: { pIdPersona: 8 },
    responseFields: [responseField("pEliminado", "scalar", "BigDecimal")]
  }),
  operation({
    id: "gsSpGetPersona",
    category: "procedure",
    body: { pIdPersona: 7 },
    responseFields: [responseField("pPersona", "object", "GsPersonaObj")]
  }),
  operation({
    id: "gsSpLobValues",
    category: "procedure",
    body: { pTextoIn: "Archivo de prueba Oracle PROCEDURE LOB", pArchivoIn: "T3JhY2xlIFByb2NlZHVyZSBMT0I=" },
    responseFields: [
      responseField("pTextoOut", "scalar"),
      responseField("pArchivoOut", "blob", "byte[]"),
      responseField("pTextoLength", "scalar"),
      responseField("pArchivoLength", "scalar")
    ]
  }),
  operation({
    id: "gsSpGetThreeCursors",
    category: "procedure",
    responseFields: [
      responseField("pPersonas", "array", "List<PPersonas>"),
      responseField("pHijos", "array", "List<PHijos>"),
      responseField("pDirecciones", "array", "List<PDirecciones>")
    ]
  }),
  operation({
    id: "gsSpGetPersonasDetalle",
    category: "procedure",
    responseFields: [responseField("pPersonas", "array", "GsPersonaDetalleTabArray<GsPersonaDetalleObj>")]
  }),
  operation({
    id: "gsSpCursorInWithOutputs",
    category: "procedure",
    body: { pEntrada: PERSONA_CURSOR_SAMPLE },
    responseFields: [responseField("pTotal", "scalar"), responseField("pPersonas", "array", "List<PPersonas>")]
  }),
  operation({
    id: "gsSpLobCursor",
    category: "procedure",
    responseFields: [responseField("pLobs", "array", "List<PLobs>")]
  }),
  operation({
    id: "gsSpArraysPrimitivosOut",
    category: "procedure",
    responseFields: [
      responseField("pNumeros", "array"),
      responseField("pEnteros", "array"),
      responseField("pBooleanos", "array"),
      responseField("pTextos", "array"),
      responseField("pFechas", "array"),
      responseField("pTimestamps", "array")
    ]
  }),
  operation({
    id: "gsSpCursorOutNoMetadata",
    category: "procedure",
    body: { pAbrirCursor: 10 },
    responseFields: [responseField("pPersonas", "scalar"), responseField("pTotal", "scalar"), responseField("pMensaje", "scalar")]
  }),
  operation({
    id: "gsSpLobInout",
    category: "procedure",
    body: { pTexto: "Documento INOUT actualizado desde Postman", pArchivo: "T0JBQ0xFIEJMT0IgSU5PVVQ=" },
    responseFields: [
      responseField("pTexto", "scalar"),
      responseField("pArchivo", "blob", "byte[]"),
      responseField("pTextoLength", "scalar"),
      responseField("pArchivoLength", "scalar")
    ]
  }),
  operation({
    id: "gsSpGetPersonas",
    category: "procedure",
    responseFields: [responseField("pPersonas", "array", "GsPersonaTabArray<GsPersonaObj>")]
  }),
  operation({
    id: "gsSpGetPersonaDetalle",
    category: "procedure",
    body: { pIdPersona: 1 },
    responseFields: [responseField("pPersona", "object", "GsPersonaDetalleObj")]
  }),
  operation({
    id: "gsSpCursorInoutPersonas",
    category: "procedure",
    body: { pPersonas: PERSONA_CURSOR_SAMPLE },
    responseFields: [responseField("pPersonas", "array", "List<PPersonas>"), responseField("pTotal", "scalar")]
  }),

  operation({ id: "gsFnCountPersonas", category: "function", responseFields: [responseField("gsFnCountPersonas", "scalar")] }),
  operation({ id: "gsFnTypeNombre", category: "function", body: { pIdPersona: 1 }, responseFields: [responseField("gsFnTypeNombre", "scalar")] }),
  operation({ id: "gsFnPipePersonas", category: "function", body: { pActivo: 1 }, responseFields: [responseField("gsFnPipePersonas", "array", "GsPersonaTabArray<GsPersonaObj>")] }),
  operation({ id: "gsFnGetPersonasTab", category: "function", responseFields: [responseField("gsFnGetPersonasTab", "array", "GsPersonaTabArray<GsPersonaObj>")] }),
  operation({
    id: "gsFnCursorInoutPersonas",
    category: "function",
    body: { pPersonas: PERSONA_CURSOR_SAMPLE },
    responseFields: [responseField("pPersonas", "array", "List<PPersonas>"), responseField("gsFnCursorInoutPersonas", "scalar")]
  }),
  operation({
    id: "gsFnCursorReturnWithOut",
    category: "function",
    body: { pActivo: 1 },
    responseFields: [responseField("pTotal", "scalar"), responseField("gsFnCursorReturnWithOut", "array", "List<GsFnCursorReturnWithOut>")]
  }),
  operation({ id: "gsFnGetPersonasCursor", category: "function", responseFields: [responseField("gsFnGetPersonasCursor", "array", "List<GsFnGetPersonasCursor>")] }),
  operation({ id: "gsFnCursorInCount", category: "function", body: { pPersonas: PERSONA_CURSOR_SAMPLE }, responseFields: [responseField("gsFnCursorInCount", "scalar")] }),
  operation({ id: "gsFnGetPersonaObj", category: "function", body: { pIdPersona: 1 }, responseFields: [responseField("gsFnGetPersonaObj", "object", "GsPersonaObj")] }),

  operation({ id: "fnCountPersonas", category: "package", responseFields: [responseField("fnCountPersonas", "scalar")] }),
  operation({ id: "pipePersonas", category: "package", body: { pActivo: 0 }, responseFields: [responseField("pipePersonas", "array", "GsPersonaTabArray<GsPersonaObj>")] }),
  operation({ id: "getPersonasCursor", category: "package", responseFields: [responseField("pPersonas", "array", "List<PPersonas>")] }),
  operation({ id: "getPersona", category: "package", body: { pIdPersona: 3 }, responseFields: [responseField("pPersona", "object", "GsPersonaObj")] }),
  operation({ id: "fnGetPersonasCursor", category: "package", responseFields: [responseField("fnGetPersonasCursor", "array", "List<FnGetPersonasCursor>")] }),
  operation({
    id: "arraysPrimitivosInout",
    category: "package",
    body: { pNumeros: [5, 10, 15, 20], pTextos: ["alfa", "beta", "gamma"] },
    responseFields: [
      responseField("pTextos", "array"),
      responseField("pFechas", "array"),
      responseField("pTimestamps", "array"),
      responseField("pTotal", "scalar"),
      responseField("pSuma", "scalar")
    ]
  }),
  operation({ id: "cursorInWithOutputs", category: "package", body: { pEntrada: PERSONA_CURSOR_SAMPLE }, responseFields: [responseField("pTotal", "scalar"), responseField("pPersonas", "array", "List<PPersonas>")] }),

  operation({ id: "gsQUpdatePersonass", label: "gsQUpdatePersona", category: "query", body: { nombre: "Mateo", apellido: "Rojas", edad: 39, email: "mateo.rojas@example.com", fechaNacimiento: "1987-03-21", activo: true, idPersona: 12 }, responseKind: "boolean" }),
  operation({ id: "gsQPersonasTotalHijosWith", category: "query", body: { activo: false }, responseFields: [responseField("gsQPersonasTotalHijosWith", "array", "List<GsQPersonasTotalHijosWithQuery>")] }),
  operation({ id: "gsQDeletePersona", category: "query", body: { idPersona: 10 }, responseKind: "boolean" }),
  operation({ id: "gsQPersonasActivasWith", category: "query", body: { activo: true }, responseFields: [responseField("gsQPersonasActivasWith", "array", "List<GsQPersonasActivasWithQuery>")] }),
  operation({ id: "gsQPersonasByCityJoinss", label: "gsQPersonasByCityJoin", category: "query", body: { ciudad: "Bogota" }, responseFields: [responseField("gsQPersonasByCityJoinss", "array", "List<GsQPersonasByCityJoinssQuery>")] }),
  operation({ id: "gsQInsertPersonaSelect", category: "query", body: { nombre: "Laura", email: "laura.casas@example.com", activo: false, idPersonaBase: 5 }, responseKind: "boolean" }),
  operation({ id: "gsQPersonaByNombre", category: "query", body: { nombre: "Santiago" }, responseFields: [responseField("gsQPersonaByNombre", "array", "List<GsQPersonaByNombreQuery>")] }),
  operation({ id: "gsQPersonaById", category: "query", body: { idPersona: 1 }, responseFields: [responseField("gsQPersonaById", "array", "List<GsQPersonaByIdQuery>")] }),
  operation({ id: "gsQInsertPersona", category: "query", body: { nombre: "Santiago", apellido: "Pardo", edad: 28, email: "santiago.pardo@example.com", fechaNacimiento: "1998-07-16", activo: true }, responseKind: "boolean" })
];

export const findOracleOperation = (operationId) => ORACLE_OPERATIONS.find((item) => item.id === operationId);
