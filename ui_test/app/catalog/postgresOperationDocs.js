export const POSTGRES_OPERATION_DOCS = {
  gsSpGetPersona: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_get_persona",
    capabilities: ["procedure", "inParameters", "outputParameters", "compositeType", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_get_persona
(
    IN p_id_persona INTEGER,
    OUT p_persona gs_persona_obj
)`
  },
  gsSpGetPersonas: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_get_personas",
    capabilities: ["procedure", "outputParameters", "arrayType", "compositeType", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_get_personas
(
    OUT p_personas gs_persona_obj[]
)`
  },
  gsSpInsertPersona: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_insert_persona",
    capabilities: ["procedure", "inParameters", "outputParameters", "compositeType", "insert", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_insert_persona
(
    IN p_persona gs_persona_obj,
    OUT p_id_persona INTEGER
)`
  },
  gsSpInsertPersonas: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_insert_personas",
    capabilities: ["procedure", "inParameters", "outputParameters", "arrayType", "compositeType", "insert", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_insert_personas
(
    IN p_personas gs_persona_obj[],
    OUT p_insertados INTEGER
)`
  },
  gsSpUpdatePersona: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_update_persona",
    capabilities: ["procedure", "inParameters", "outputParameters", "compositeType", "update", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_update_persona
(
    IN p_persona gs_persona_obj,
    OUT p_actualizado BOOLEAN
)`
  },
  gsSpDeletePersona: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_delete_persona",
    capabilities: ["procedure", "inParameters", "outputParameters", "delete", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_delete_persona
(
    IN p_id_persona INTEGER,
    OUT p_eliminado BOOLEAN
)`
  },
  gsSpSavePersonaJsonbInout: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_save_persona_jsonb_inout",
    capabilities: ["procedure", "inOutParameters", "jsonb", "naturalJson", "insert", "update", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_save_persona_jsonb_inout
(
    INOUT p_persona JSONB
)

p_persona := jsonb_build_object(
    'idPersona', v_id_persona,
    'accion', v_accion
);`
  },
  gsSpResumenPersonas: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_resumen_personas",
    capabilities: ["procedure", "outputParameters", "aggregate", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_resumen_personas
(
    OUT p_total INTEGER,
    OUT p_activos INTEGER,
    OUT p_inactivos INTEGER
)`
  },
  gsSpGetPersonaDetalle: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_get_persona_detalle",
    capabilities: ["procedure", "inParameters", "outputParameters", "compositeType", "arrayType", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_get_persona_detalle
(
    IN p_id_persona INTEGER,
    OUT p_persona gs_persona_detalle_obj
)`
  },
  gsSpGetPersonasDetalle: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_get_personas_detalle",
    capabilities: ["procedure", "outputParameters", "compositeType", "arrayType", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_get_personas_detalle
(
    OUT p_personas gs_persona_detalle_obj[]
)`
  },
  gsSpGetPersonasCursorOut: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_get_personas_cursor_out",
    capabilities: ["procedure", "inParameters", "outputParameters", "refcursor", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_get_personas_cursor_out
(
    IN p_activo BOOLEAN,
    OUT p_cursor REFCURSOR
)`
  },
  gsSpGetPersonasCursorInout: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_get_personas_cursor_inout",
    capabilities: ["procedure", "inParameters", "inOutParameters", "refcursor", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_get_personas_cursor_inout
(
    IN p_activo BOOLEAN,
    INOUT p_cursor REFCURSOR
)`
  },
  gsSpResumenPersonasOut: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_resumen_personas_out",
    capabilities: ["procedure", "outputParameters", "aggregate", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_resumen_personas_out
(
    OUT p_total INTEGER,
    OUT p_activos INTEGER,
    OUT p_inactivos INTEGER,
    OUT p_tiene_inactivos BOOLEAN
)`
  },
  gsSpInsertarPersonasCursor: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_insertar_personas_cursor",
    capabilities: ["procedure", "inParameters", "outputParameters", "refcursor", "insert", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_insertar_personas_cursor
(
    IN p_cursor REFCURSOR,
    OUT p_total_procesados INTEGER
)`
  },
  gsSpGetPersonasEstadoCursor: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_get_personas_estado_cursor",
    capabilities: ["procedure", "outputParameters", "refcursor", "multipleCursors", "post"],
    source: `CREATE OR REPLACE PROCEDURE public.gs_sp_get_personas_estado_cursor
(
    OUT p_cursor_activos REFCURSOR,
    OUT p_cursor_inactivos REFCURSOR
)`
  },
  gsSpGetPersonaJson: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_get_persona_json",
    capabilities: ["procedure", "inParameters", "outputParameters", "json", "naturalJson", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_get_persona_json
(
    IN p_id_persona INTEGER,
    OUT p_persona JSON
)

SELECT json_build_object(
    'idPersona', p.id_persona,
    'nombre', p.nombre,
    'fechaNacimiento', p.fecha_nacimiento
);`
  },
  gsSpInsertPersonaJson: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_insert_persona_json",
    capabilities: ["procedure", "inParameters", "outputParameters", "json", "naturalJson", "insert", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_insert_persona_json
(
    IN p_persona JSON,
    OUT p_id_persona INTEGER
)

VALUES
(
    p_persona ->> 'nombre',
    p_persona ->> 'apellido',
    NULLIF(p_persona ->> 'edad', '')::INTEGER
)`
  },
  gsSpUpdatePersonaJson: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_update_persona_json",
    capabilities: ["procedure", "inParameters", "outputParameters", "json", "naturalJson", "update", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_update_persona_json
(
    IN p_persona JSON,
    OUT p_actualizado BOOLEAN
)`
  },
  gsSpSavePersonaJsonInout: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_save_persona_json_inout",
    capabilities: ["procedure", "inOutParameters", "json", "naturalJson", "insert", "update", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_save_persona_json_inout
(
    INOUT p_persona JSON
)

p_persona := json_build_object(
    'idPersona', v_id_persona,
    'accion', v_accion
);`
  },
  gsSpGetPersonaJsonb: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_get_persona_jsonb",
    capabilities: ["procedure", "inParameters", "outputParameters", "jsonb", "naturalJson", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_get_persona_jsonb
(
    IN p_id_persona INTEGER,
    OUT p_persona JSONB
)

SELECT jsonb_build_object(
    'idPersona', p.id_persona,
    'nombre', p.nombre,
    'fechaNacimiento', p.fecha_nacimiento
);`
  },
  gsSpInsertPersonaJsonb: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_insert_persona_jsonb",
    capabilities: ["procedure", "inParameters", "outputParameters", "jsonb", "naturalJson", "insert", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_insert_persona_jsonb
(
    IN p_persona JSONB,
    OUT p_id_persona INTEGER
)`
  },
  gsSpUpdatePersonaJsonb: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_update_persona_jsonb",
    capabilities: ["procedure", "inParameters", "outputParameters", "jsonb", "naturalJson", "update", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_update_persona_jsonb
(
    IN p_persona JSONB,
    OUT p_actualizado BOOLEAN
)`
  },
  gsSpIncrementarEdad: {
    sourceType: "procedure",
    sourceName: "public.gs_sp_incrementar_edad",
    capabilities: ["procedure", "inOutParameters", "post"],
    source: `CREATE OR REPLACE PROCEDURE gs_sp_incrementar_edad
(
    INOUT p_edad INTEGER
)`
  },
  gsFnGetPersonasTable: {
    sourceType: "setReturningFunction",
    sourceName: "public.gs_fn_get_personas_table",
    capabilities: ["function", "setReturningFunction", "inParameters", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_get_personas_table
(
    p_activo BOOLEAN
)
RETURNS TABLE
(
    id_persona INTEGER,
    nombre VARCHAR(100),
    activo BOOLEAN,
    fecha_registro TIMESTAMP
)`
  },
  gsFnGetPersonasSetof: {
    sourceType: "setReturningFunction",
    sourceName: "public.gs_fn_get_personas_setof",
    capabilities: ["function", "setReturningFunction", "inParameters", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_get_personas_setof
(
    p_activo BOOLEAN
)
RETURNS SETOF gs_persona`
  },
  gsFnGetPersonaRow: {
    sourceType: "function",
    sourceName: "public.gs_fn_get_persona_row",
    capabilities: ["function", "inParameters", "compositeType", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_get_persona_row
(
    p_id_persona INTEGER
)
RETURNS gs_persona`
  },
  gsFnGetPersonaObj: {
    sourceType: "function",
    sourceName: "public.gs_fn_get_persona_obj",
    capabilities: ["function", "inParameters", "compositeType", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_get_persona_obj
(
    p_id_persona INTEGER
)
RETURNS gs_persona_obj`
  },
  gsFnGetPersonasNombresSetof: {
    sourceType: "setReturningFunction",
    sourceName: "public.gs_fn_get_personas_nombres_setof",
    capabilities: ["function", "setReturningFunction", "inParameters", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_get_personas_nombres_setof
(
    p_activo BOOLEAN
)
RETURNS SETOF VARCHAR`
  },
  gsFnGetPersonasJsonSetof: {
    sourceType: "setReturningFunction",
    sourceName: "public.gs_fn_get_personas_json_setof",
    capabilities: ["function", "setReturningFunction", "json", "naturalJson", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_get_personas_json_setof()
RETURNS SETOF JSON

SELECT json_build_object(
    'idPersona', p.id_persona,
    'nombre', p.nombre,
    'fechaNacimiento', p.fecha_nacimiento
)`
  },
  gsFnGetPersonasJsonbSetof: {
    sourceType: "setReturningFunction",
    sourceName: "public.gs_fn_get_personas_jsonb_setof",
    capabilities: ["function", "setReturningFunction", "jsonb", "naturalJson", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_get_personas_jsonb_setof()
RETURNS SETOF JSONB

SELECT jsonb_build_object(
    'idPersona', p.id_persona,
    'nombre', p.nombre,
    'fechaNacimiento', p.fecha_nacimiento
)`
  },
  gsFnGetPersonaJsonObj: {
    sourceType: "function",
    sourceName: "public.gs_fn_get_persona_json_obj",
    capabilities: ["function", "inParameters", "compositeType", "jsonb", "naturalJson", "post"],
    source: `CREATE TYPE gs_persona_json_obj AS
(
    id_persona INTEGER,
    nombre VARCHAR(100),
    datos JSONB
);

CREATE OR REPLACE FUNCTION gs_fn_get_persona_json_obj
(
    p_id_persona INTEGER
)
RETURNS gs_persona_json_obj`
  },
  gsFnSavePersonaJsonObj: {
    sourceType: "function",
    sourceName: "public.gs_fn_save_persona_json_obj",
    capabilities: ["function", "inParameters", "compositeType", "jsonb", "naturalJson", "insert", "update", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_save_persona_json_obj
(
    p_persona gs_persona_json_obj
)
RETURNS BOOLEAN

v_datos := COALESCE((p_persona).datos, '{}'::jsonb);`
  },
  gsFnResumenPersonas: {
    sourceType: "function",
    sourceName: "public.gs_fn_resumen_personas",
    capabilities: ["function", "outputParameters", "aggregate", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_resumen_personas
(
    OUT total INTEGER,
    OUT activos INTEGER,
    OUT inactivos INTEGER
)`
  },
  gsFnGetPersonasPorEstado: {
    sourceType: "setReturningFunction",
    sourceName: "public.gs_fn_get_personas_por_estado",
    capabilities: ["function", "setReturningFunction", "inParameters", "defaultParameter", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_get_personas_por_estado
(
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS SETOF gs_persona`
  },
  gsFnBuscarPersona: {
    sourceType: "function",
    sourceName: "public.gs_fn_buscar_persona",
    capabilities: ["function", "inParameters", "compositeType", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_buscar_persona(p_id_persona INTEGER)
RETURNS gs_persona`
  },
  gsFnGetPersonasPorIds: {
    sourceType: "setReturningFunction",
    sourceName: "public.gs_fn_get_personas_por_ids",
    capabilities: ["function", "setReturningFunction", "inParameters", "arrayType", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_get_personas_por_ids
(
    p_ids INTEGER[]
)
RETURNS SETOF gs_persona`
  },
  gsFnGetPersonaNullable: {
    sourceType: "setReturningFunction",
    sourceName: "public.gs_fn_get_persona_nullable",
    capabilities: ["function", "setReturningFunction", "inParameters", "nullable", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_get_persona_nullable
(
    p_id_persona INTEGER
)
RETURNS TABLE
(
    id_persona INTEGER,
    edad INTEGER,
    email VARCHAR,
    fecha_nacimiento DATE
)`
  },
  gsFnTouchPersonaVoid: {
    sourceType: "function",
    sourceName: "public.gs_fn_touch_persona_void",
    capabilities: ["function", "inParameters", "voidReturn", "update", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_touch_persona_void
(
    p_id_persona INTEGER
)
RETURNS VOID`
  },
  gsFnInsertPersonaThenError: {
    sourceType: "function",
    sourceName: "public.gs_fn_insert_persona_then_error",
    capabilities: ["function", "inParameters", "voidReturn", "insert", "transactionRollback", "errorPath", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_insert_persona_then_error
(
    p_nombre VARCHAR,
    p_apellido VARCHAR
)
RETURNS VOID

RAISE EXCEPTION 'Error controlado despues de insertar persona';`
  },
  gsFnErrorControlado: {
    sourceType: "function",
    sourceName: "public.gs_fn_error_controlado",
    capabilities: ["function", "errorPath", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_error_controlado()
RETURNS BOOLEAN

RAISE EXCEPTION 'Error controlado de prueba';`
  },
  gsFnIncrementarEdadInout: {
    sourceType: "function",
    sourceName: "public.gs_fn_incrementar_edad_inout",
    capabilities: ["function", "inOutParameters", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_incrementar_edad_inout
(
    INOUT p_edad INTEGER
)`
  },
  gsFnResumenInout: {
    sourceType: "function",
    sourceName: "public.gs_fn_resumen_inout",
    capabilities: ["function", "inOutParameters", "aggregate", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_resumen_inout
(
    INOUT p_total INTEGER,
    INOUT p_activos INTEGER,
    INOUT p_inactivos INTEGER
)`
  },
  gsFnResumenMixto: {
    sourceType: "function",
    sourceName: "public.gs_fn_resumen_mixto",
    capabilities: ["function", "inOutParameters", "outputParameters", "aggregate", "post"],
    source: `CREATE OR REPLACE FUNCTION gs_fn_resumen_mixto
(
    INOUT p_total INTEGER,
    OUT p_activos INTEGER,
    OUT p_inactivos INTEGER
)`
  },
  gsQPersonaById: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONA_BY_ID",
    capabilities: ["query", "select", "inParameters", "post"],
    source: `SELECT id_persona, nombre, apellido, edad, email, fecha_nacimiento, activo, fecha_registro
FROM gs_persona
WHERE id_persona = :id_persona;`
  },
  gsQPersonasByNombre: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_BY_NOMBRE",
    capabilities: ["query", "select", "inParameters", "post"],
    source: `SELECT id_persona, nombre, apellido, edad, email, fecha_nacimiento, activo, fecha_registro
FROM gs_persona
WHERE nombre ILIKE CONCAT('%', CAST(:nombre AS VARCHAR), '%')
ORDER BY id_persona;`
  },
  gsQPersonasByActivo: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_BY_ACTIVO",
    capabilities: ["query", "select", "inParameters", "post"],
    source: `SELECT id_persona AS persona_id, nombre, apellido, edad, email, activo
FROM gs_persona
WHERE activo = :activo
ORDER BY id_persona;`
  },
  gsQPersonasSelfJoinActivo: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_SELF_JOIN_ACTIVO",
    capabilities: ["query", "select", "join", "inParameters", "post"],
    source: `SELECT p.id_persona AS persona_id, p.nombre, p.apellido,
       r.id_persona AS referencia_id, r.activo AS activo_referencia
FROM gs_persona p
INNER JOIN gs_persona r ON r.activo = p.activo
WHERE r.id_persona = :id_persona_referencia
ORDER BY p.id_persona;`
  },
  gsQPersonasActivasWith: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_ACTIVAS_WITH",
    capabilities: ["query", "select", "with", "inParameters", "post"],
    source: `WITH personas_filtradas AS (
    SELECT id_persona, nombre, apellido, activo
    FROM gs_persona
    WHERE activo = :activo
)
SELECT id_persona, nombre, apellido, activo
FROM personas_filtradas
ORDER BY id_persona;`
  },
  gsQPersonasTotalHijosWith: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_TOTAL_HIJOS_WITH",
    capabilities: ["query", "select", "with", "join", "aggregate", "inParameters", "post"],
    source: `WITH hijos_por_persona AS (
    SELECT id_persona, COUNT(1)::INTEGER AS total_hijos
    FROM gs_hijo
    GROUP BY id_persona
)
SELECT p.id_persona, p.nombre, p.apellido, p.activo,
       COALESCE(h.total_hijos, 0)::INTEGER AS total_hijos
FROM gs_persona p
LEFT JOIN hijos_por_persona h ON h.id_persona = p.id_persona
WHERE p.activo = :activo
ORDER BY p.id_persona;`
  },
  gsQPersonasStatsWith: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_STATS_WITH",
    capabilities: ["query", "select", "with", "aggregate", "inParameters", "post"],
    source: `WITH personas_filtradas AS (
    SELECT id_persona, edad, activo
    FROM gs_persona
    WHERE activo = :activo
)
SELECT COUNT(*)::INTEGER AS total_personas,
       COALESCE(AVG(edad)::NUMERIC(10,2), 0) AS edad_promedio,
       COALESCE(MIN(edad), 0)::INTEGER AS edad_minima,
       COALESCE(MAX(edad), 0)::INTEGER AS edad_maxima
FROM personas_filtradas;`
  },
  gsQPersonasByCityJoin: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_BY_CITY_JOIN",
    capabilities: ["query", "select", "join", "inParameters", "post"],
    source: `SELECT p.id_persona, p.nombre, p.apellido, d.pais, d.ciudad, d.telefono
FROM gs_persona p
INNER JOIN gs_persona_direccion d ON d.id_persona = p.id_persona
WHERE d.ciudad = :ciudad
ORDER BY p.id_persona;`
  },
  gsQPersonasByJson: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_BY_JSON",
    capabilities: ["query", "select", "json", "naturalJson", "join", "inParameters", "post"],
    source: `SELECT p.id_persona, p.nombre, p.apellido, p.edad, p.email,
       p.fecha_nacimiento, p.activo, p.fecha_registro
FROM json_array_elements(CAST(:personas_json AS json)) AS item(persona)
INNER JOIN gs_persona p ON p.id_persona = (item.persona ->> 'idPersona')::INTEGER
ORDER BY p.id_persona;`
  },
  gsQPersonasByJsonb: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_BY_JSONB",
    capabilities: ["query", "select", "jsonb", "naturalJson", "join", "inParameters", "post"],
    source: `SELECT p.id_persona, p.nombre, p.apellido, p.edad, p.email,
       p.fecha_nacimiento, p.activo, p.fecha_registro
FROM jsonb_array_elements(CAST(:personas_jsonb AS jsonb)) AS item(persona)
INNER JOIN gs_persona p ON p.id_persona = (item.persona ->> 'idPersona')::INTEGER
ORDER BY p.id_persona;`
  },
  gsQPersonasAsJson: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_AS_JSON",
    capabilities: ["query", "select", "json", "naturalJson", "aggregate", "inParameters", "post"],
    source: `SELECT COALESCE(
    json_agg(json_build_object(
        'idPersona', id_persona,
        'nombre', nombre,
        'apellido', apellido,
        'edad', edad,
        'email', email,
        'fechaNacimiento', fecha_nacimiento,
        'activo', activo,
        'fechaRegistro', fecha_registro
    ) ORDER BY id_persona),
    '[]'::json
) AS personas_json
FROM gs_persona
WHERE activo = :activo;`
  },
  gsQPersonasAsJsonb: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_AS_JSONB",
    capabilities: ["query", "select", "jsonb", "naturalJson", "aggregate", "inParameters", "post"],
    source: `SELECT COALESCE(
    jsonb_agg(jsonb_build_object(
        'idPersona', id_persona,
        'nombre', nombre,
        'apellido', apellido,
        'edad', edad,
        'email', email,
        'fechaNacimiento', fecha_nacimiento,
        'activo', activo,
        'fechaRegistro', fecha_registro
    ) ORDER BY id_persona),
    '[]'::jsonb
) AS personas_jsonb
FROM gs_persona
WHERE activo = :activo;`
  },
  gsQInsertPersona: {
    sourceType: "query",
    sourceName: "GS_Q_INSERT_PERSONA",
    capabilities: ["query", "insert", "inParameters", "post"],
    source: `INSERT INTO gs_persona
(nombre, apellido, edad, email, fecha_nacimiento, activo)
VALUES (:nombre, :apellido, :edad, :email, :fecha_nacimiento, :activo);`
  },
  gsQInsertPersonaSelect: {
    sourceType: "query",
    sourceName: "GS_Q_INSERT_PERSONA_SELECT",
    capabilities: ["query", "insert", "select", "inParameters", "post"],
    source: `INSERT INTO gs_persona
(nombre, apellido, edad, email, fecha_nacimiento, activo)
SELECT :nombre, p.apellido, p.edad, :email, p.fecha_nacimiento, :activo
FROM gs_persona p
WHERE p.id_persona = :id_persona_base;`
  },
  gsQUpdatePersona: {
    sourceType: "query",
    sourceName: "GS_Q_UPDATE_PERSONA",
    capabilities: ["query", "update", "inParameters", "post"],
    source: `UPDATE gs_persona
SET nombre = :nombre,
    apellido = :apellido,
    edad = :edad,
    email = :email,
    fecha_nacimiento = :fecha_nacimiento,
    activo = :activo
WHERE id_persona = :id_persona;`
  },
  gsQDeletePersona: {
    sourceType: "query",
    sourceName: "GS_Q_DELETE_PERSONA",
    capabilities: ["query", "delete", "inParameters", "post"],
    source: `DELETE FROM gs_persona
WHERE id_persona = :id_persona;`
  }
};