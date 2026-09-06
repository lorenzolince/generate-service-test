const procedureDoc = (sourceName, source, capabilities = []) => ({
  sourceType: "procedure",
  sourceName,
  capabilities: ["procedure", ...capabilities, "post"],
  source
});

const functionDoc = (sourceName, source, capabilities = []) => ({
  sourceType: "function",
  sourceName,
  capabilities: ["function", ...capabilities, "post"],
  source
});

const queryDoc = (sourceName, source, capabilities = []) => ({
  sourceType: "query",
  sourceName,
  capabilities: ["query", ...capabilities, "post"],
  source
});

export const MYSQL_OPERATION_DOCS = {
  gsSpGetAllPersonas: procedureDoc(
    "GS_SP_GET_ALL_PERSONAS",
    `CREATE PROCEDURE GS_SP_GET_ALL_PERSONAS()
BEGIN
    SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO
    FROM GS_PERSONA
    ORDER BY ID_PERSONA;
END`,
    ["select", "resultSet"]
  ),
  gsSpGetPersona: procedureDoc(
    "GS_SP_GET_PERSONA",
    `CREATE PROCEDURE GS_SP_GET_PERSONA
(
    IN P_ID_PERSONA INT
)
BEGIN
    SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO
    FROM GS_PERSONA
    WHERE ID_PERSONA = P_ID_PERSONA;
END`,
    ["inParameters", "select", "resultSet"]
  ),
  gsSpGetPersonasByEstado: procedureDoc(
    "GS_SP_GET_PERSONAS_BY_ESTADO",
    `CREATE PROCEDURE GS_SP_GET_PERSONAS_BY_ESTADO
(
    IN P_ACTIVO BOOLEAN
)
BEGIN
    SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre_completo, APELLIDO AS apellido_completo,
           EDAD AS edad_actual, EMAIL AS correo, FECHA_NACIMIENTO AS nacimiento,
           ACTIVO AS estado, FECHA_REGISTRO AS fecha_alta
    FROM GS_PERSONA
    WHERE ACTIVO = P_ACTIVO
    ORDER BY ID_PERSONA;
END`,
    ["inParameters", "select", "resultSet"]
  ),
  gsSpInsertPersona: procedureDoc(
    "GS_SP_INSERT_PERSONA",
    `CREATE PROCEDURE GS_SP_INSERT_PERSONA
(
    IN P_NOMBRE VARCHAR(100),
    IN P_APELLIDO VARCHAR(100),
    IN P_EDAD INT,
    IN P_EMAIL VARCHAR(150),
    IN P_FECHA_NACIMIENTO DATE,
    IN P_ACTIVO BOOLEAN
)
BEGIN
    INSERT INTO GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO)
    VALUES (P_NOMBRE, P_APELLIDO, P_EDAD, P_EMAIL, P_FECHA_NACIMIENTO, P_ACTIVO);
END`,
    ["inParameters", "insert", "dml"]
  ),
  gsSpUpdatePersona: procedureDoc(
    "GS_SP_UPDATE_PERSONA",
    `CREATE PROCEDURE GS_SP_UPDATE_PERSONA
(
    IN P_ID_PERSONA INT,
    IN P_NOMBRE VARCHAR(100),
    IN P_APELLIDO VARCHAR(100),
    IN P_EDAD INT,
    IN P_EMAIL VARCHAR(150),
    IN P_FECHA_NACIMIENTO DATE,
    IN P_ACTIVO BOOLEAN
)
BEGIN
    UPDATE GS_PERSONA
       SET NOMBRE = P_NOMBRE,
           APELLIDO = P_APELLIDO,
           EDAD = P_EDAD,
           EMAIL = P_EMAIL,
           FECHA_NACIMIENTO = P_FECHA_NACIMIENTO,
           ACTIVO = P_ACTIVO
     WHERE ID_PERSONA = P_ID_PERSONA;
END`,
    ["inParameters", "update", "dml"]
  ),
  gsSpInsertSelectPersona: procedureDoc(
    "GS_SP_INSERT_SELECT_PERSONA",
    `CREATE PROCEDURE GS_SP_INSERT_SELECT_PERSONA
(
    IN P_NOMBRE VARCHAR(100),
    IN P_APELLIDO VARCHAR(100),
    IN P_EDAD INT,
    IN P_EMAIL VARCHAR(150),
    IN P_FECHA_NACIMIENTO DATE,
    IN P_ACTIVO BOOLEAN
)
BEGIN
    INSERT INTO GS_PERSONA (...);
    SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad,
           EMAIL AS email, FECHA_NACIMIENTO AS fecha_nacimiento, ACTIVO AS activo,
           FECHA_REGISTRO AS fecha_registro
    FROM GS_PERSONA
    WHERE ID_PERSONA = LAST_INSERT_ID();
END`,
    ["inParameters", "insert", "select", "resultSet"]
  ),
  gsSpUpdateSelectPersona: procedureDoc(
    "GS_SP_UPDATE_SELECT_PERSONA",
    `CREATE PROCEDURE GS_SP_UPDATE_SELECT_PERSONA
(
    IN P_ID_PERSONA INT,
    IN P_NOMBRE VARCHAR(100),
    IN P_APELLIDO VARCHAR(100),
    IN P_EDAD INT,
    IN P_EMAIL VARCHAR(150),
    IN P_FECHA_NACIMIENTO DATE,
    IN P_ACTIVO BOOLEAN
)
BEGIN
    UPDATE GS_PERSONA SET ... WHERE ID_PERSONA = P_ID_PERSONA;
    SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad,
           EMAIL AS email, FECHA_NACIMIENTO AS fecha_nacimiento, ACTIVO AS activo,
           FECHA_REGISTRO AS fecha_registro
    FROM GS_PERSONA
    WHERE ID_PERSONA = P_ID_PERSONA;
END`,
    ["inParameters", "update", "select", "resultSet"]
  ),
  gsSpMultiResultPersona: procedureDoc(
    "GS_SP_MULTI_RESULT_PERSONA",
    `CREATE PROCEDURE GS_SP_MULTI_RESULT_PERSONA
(
    IN P_ACTIVO BOOLEAN
)
BEGIN
    SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad
    FROM GS_PERSONA
    WHERE ACTIVO = P_ACTIVO;

    SELECT COUNT(*) AS total_personas,
           COALESCE(AVG(EDAD), 0) AS edad_promedio,
           COALESCE(MIN(EDAD), 0) AS edad_minima,
           COALESCE(MAX(EDAD), 0) AS edad_maxima
    FROM GS_PERSONA
    WHERE ACTIVO = P_ACTIVO;
END`,
    ["inParameters", "select", "multipleResultSets", "aggregate"]
  ),
  gsSpMultiOperationPersona: procedureDoc(
    "GS_SP_MULTI_OPERATION_PERSONA",
    `CREATE PROCEDURE GS_SP_MULTI_OPERATION_PERSONA
(
    IN P_NOMBRE VARCHAR(100),
    IN P_APELLIDO VARCHAR(100),
    IN P_EDAD INT,
    IN P_EMAIL VARCHAR(150),
    IN P_FECHA_NACIMIENTO DATE,
    IN P_ACTIVO BOOLEAN
)
BEGIN
    INSERT INTO GS_PERSONA (...);
    UPDATE GS_PERSONA SET NOMBRE = CONCAT(NOMBRE, ' UPDATED'), EDAD = EDAD + 1 WHERE ID_PERSONA = LAST_INSERT_ID();
    SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad,
           EMAIL AS email, FECHA_NACIMIENTO AS fecha_nacimiento, ACTIVO AS activo,
           FECHA_REGISTRO AS fecha_registro
    FROM GS_PERSONA
    WHERE ID_PERSONA = LAST_INSERT_ID();
END`,
    ["inParameters", "insert", "update", "select", "resultSet"]
  ),
  gsSpInsertPersonaJson: procedureDoc(
    "GS_SP_INSERT_PERSONA_JSON",
    `CREATE PROCEDURE GS_SP_INSERT_PERSONA_JSON
(
    IN P_PERSONA JSON
)
BEGIN
    INSERT INTO GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO)
    VALUES (
        JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.nombre')),
        JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.apellido')),
        CAST(JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.edad')) AS UNSIGNED),
        JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.email')),
        STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.fechaNacimiento')), '%Y-%m-%d'),
        CASE LOWER(JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.activo')))
          WHEN 'true' THEN TRUE
          WHEN '1' THEN TRUE
          ELSE FALSE
        END
    );
END`,
    ["inParameters", "json", "naturalJson", "insert"]
  ),
  gsSpInsertPersonasJsonArray: procedureDoc(
    "GS_SP_INSERT_PERSONAS_JSON_ARRAY",
    `CREATE PROCEDURE GS_SP_INSERT_PERSONAS_JSON_ARRAY
(
    IN P_PERSONAS JSON
)
BEGIN
    INSERT INTO GS_PERSONA (...)
    SELECT JSON_UNQUOTE(JSON_EXTRACT(PERSONA, '$.nombre')), ...
    FROM JSON_TABLE(P_PERSONAS, '$[*]' COLUMNS (PERSONA JSON PATH '$')) AS T;
END`,
    ["inParameters", "json", "naturalJson", "jsonTable", "insert"]
  ),
  gsSpGetPersonaJson: procedureDoc(
    "GS_SP_GET_PERSONA_JSON",
    `CREATE PROCEDURE GS_SP_GET_PERSONA_JSON
(
    IN P_ID_PERSONA INT,
    OUT P_PERSONA JSON
)
BEGIN
    SELECT JSON_OBJECT('idPersona', ID_PERSONA, 'nombre', NOMBRE, 'apellido', APELLIDO,
                       'edad', EDAD, 'email', EMAIL, 'fechaNacimiento', FECHA_NACIMIENTO,
                       'activo', ACTIVO, 'fechaRegistro', FECHA_REGISTRO)
    INTO P_PERSONA
    FROM GS_PERSONA
    WHERE ID_PERSONA = P_ID_PERSONA;
END`,
    ["inParameters", "outputParameters", "json", "naturalJson"]
  ),
  gsSpGetPersonasJsonArray: procedureDoc(
    "GS_SP_GET_PERSONAS_JSON_ARRAY",
    `CREATE PROCEDURE GS_SP_GET_PERSONAS_JSON_ARRAY
(
    IN P_ACTIVO BOOLEAN,
    OUT P_PERSONAS JSON
)
BEGIN
    SELECT JSON_ARRAYAGG(JSON_OBJECT('idPersona', ID_PERSONA, 'nombre', NOMBRE, 'apellido', APELLIDO,
                                    'edad', EDAD, 'email', EMAIL, 'fechaNacimiento', FECHA_NACIMIENTO,
                                    'activo', ACTIVO, 'fechaRegistro', FECHA_REGISTRO))
    INTO P_PERSONAS
    FROM GS_PERSONA
    WHERE ACTIVO = P_ACTIVO;
END`,
    ["inParameters", "outputParameters", "json", "naturalJson"]
  ),
  gsSpInsertJsonResultset: procedureDoc(
    "GS_SP_INSERT_JSON_RESULTSET",
    `CREATE PROCEDURE GS_SP_INSERT_JSON_RESULTSET
(
    IN P_PERSONA JSON
)
BEGIN
    SELECT JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.nombre')) AS name,
           JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.apellido')) AS last_name,
           CAST(JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.edad')) AS UNSIGNED) AS age,
           JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.email')) AS email,
           STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(P_PERSONA, '$.fechaNacimiento')), '%Y-%m-%d') AS birthday;

    INSERT INTO GS_PERSONA (...);

    SELECT ID_PERSONA AS id_persona, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad,
           EMAIL AS email, FECHA_NACIMIENTO AS fecha_nacimiento, ACTIVO AS activo,
           FECHA_REGISTRO AS fecha_registro
    FROM GS_PERSONA
    WHERE ID_PERSONA = LAST_INSERT_ID();
END`,
    ["inParameters", "json", "naturalJson", "insert", "multipleResultSets"]
  ),
  gsSpCountPersonasOut: procedureDoc(
    "GS_SP_COUNT_PERSONAS_OUT",
    `CREATE PROCEDURE GS_SP_COUNT_PERSONAS_OUT
(
    OUT P_TOTAL INT
)
BEGIN
    SELECT COUNT(*) INTO P_TOTAL FROM GS_PERSONA;
END`,
    ["outputParameters", "aggregate"]
  ),
  gsSpGetPersonaResumenOut: procedureDoc(
    "GS_SP_GET_PERSONA_RESUMEN_OUT",
    `CREATE PROCEDURE GS_SP_GET_PERSONA_RESUMEN_OUT
(
    IN P_ID_PERSONA INT,
    OUT P_NOMBRE_COMPLETO VARCHAR(250),
    OUT P_EDAD INT,
    OUT P_ACTIVO BOOLEAN,
    OUT P_FECHA_REGISTRO DATETIME
)
BEGIN
    SELECT CONCAT(NOMBRE, ' ', APELLIDO), EDAD, ACTIVO, FECHA_REGISTRO
    INTO P_NOMBRE_COMPLETO, P_EDAD, P_ACTIVO, P_FECHA_REGISTRO
    FROM GS_PERSONA
    WHERE ID_PERSONA = P_ID_PERSONA;
END`,
    ["inParameters", "outputParameters"]
  ),
  gsSpGetMysqlTiposExtraOut: procedureDoc(
    "GS_SP_GET_MYSQL_TIPOS_EXTRA_OUT",
    `CREATE PROCEDURE GS_SP_GET_MYSQL_TIPOS_EXTRA_OUT
(
    IN P_ID_PERSONA INT,
    OUT P_SALARIO DECIMAL(12,2),
    OUT P_BIO TEXT,
    OUT P_ULTIMO_ACCESO TIMESTAMP,
    OUT P_HORA_CONTACTO TIME,
    OUT P_FOTO VARBINARY(255),
    OUT P_PERFIL_JSON JSON
)
BEGIN
    SELECT SALARIO, BIO, ULTIMO_ACCESO, HORA_CONTACTO, FOTO, PERFIL_JSON
    INTO P_SALARIO, P_BIO, P_ULTIMO_ACCESO, P_HORA_CONTACTO, P_FOTO, P_PERFIL_JSON
    FROM GS_MYSQL_TIPOS_EXTRA
    WHERE ID_PERSONA = P_ID_PERSONA;
END`,
    ["inParameters", "outputParameters", "json", "blob", "extraTypes"]
  ),
  gsSpIncrementarEdadInout: procedureDoc(
    "GS_SP_INCREMENTAR_EDAD_INOUT",
    `CREATE PROCEDURE GS_SP_INCREMENTAR_EDAD_INOUT
(
    INOUT P_EDAD INT
)
BEGIN
    SET P_EDAD = COALESCE(P_EDAD, 0) + 1;
END`,
    ["inOutParameters"]
  ),
  gsSpNormalizarEmailInout: procedureDoc(
    "GS_SP_NORMALIZAR_EMAIL_INOUT",
    `CREATE PROCEDURE GS_SP_NORMALIZAR_EMAIL_INOUT
(
    INOUT P_EMAIL VARCHAR(150)
)
BEGIN
    SET P_EMAIL = LOWER(TRIM(P_EMAIL));
END`,
    ["inOutParameters"]
  ),
  gsSpInsertPersonaOutId: procedureDoc(
    "GS_SP_INSERT_PERSONA_OUT_ID",
    `CREATE PROCEDURE GS_SP_INSERT_PERSONA_OUT_ID
(
    IN P_NOMBRE VARCHAR(100),
    IN P_APELLIDO VARCHAR(100),
    IN P_EDAD INT,
    IN P_EMAIL VARCHAR(150),
    IN P_FECHA_NACIMIENTO DATE,
    IN P_ACTIVO BOOLEAN,
    OUT P_ID_PERSONA INT
)
BEGIN
    INSERT INTO GS_PERSONA (...);
    SET P_ID_PERSONA = LAST_INSERT_ID();
END`,
    ["inParameters", "outputParameters", "insert"]
  ),
  gsSpUpdatePersonaOutCount: procedureDoc(
    "GS_SP_UPDATE_PERSONA_OUT_COUNT",
    `CREATE PROCEDURE GS_SP_UPDATE_PERSONA_OUT_COUNT
(
    IN P_ID_PERSONA INT,
    IN P_NOMBRE VARCHAR(100),
    IN P_APELLIDO VARCHAR(100),
    IN P_EDAD INT,
    IN P_EMAIL VARCHAR(150),
    IN P_FECHA_NACIMIENTO DATE,
    IN P_ACTIVO BOOLEAN,
    OUT P_FILAS_AFECTADAS INT
)
BEGIN
    UPDATE GS_PERSONA SET ... WHERE ID_PERSONA = P_ID_PERSONA;
    SET P_FILAS_AFECTADAS = ROW_COUNT();
END`,
    ["inParameters", "outputParameters", "update"]
  ),
  gsSpInsertPersonaOutResultset: procedureDoc(
    "GS_SP_INSERT_PERSONA_OUT_RESULTSET",
    `CREATE PROCEDURE GS_SP_INSERT_PERSONA_OUT_RESULTSET
(
    IN P_NOMBRE VARCHAR(100),
    IN P_APELLIDO VARCHAR(100),
    IN P_EDAD INT,
    IN P_EMAIL VARCHAR(150),
    IN P_FECHA_NACIMIENTO DATE,
    IN P_ACTIVO BOOLEAN,
    OUT P_ID_PERSONA INT
)
BEGIN
    INSERT INTO GS_PERSONA (...);
    SET P_ID_PERSONA = LAST_INSERT_ID();
    SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad,
           EMAIL AS email, FECHA_NACIMIENTO AS fecha_nacimiento, ACTIVO AS activo,
           FECHA_REGISTRO AS fecha_registro
    FROM GS_PERSONA
    WHERE ID_PERSONA = P_ID_PERSONA;
END`,
    ["inParameters", "outputParameters", "insert", "resultSet"]
  ),
  gsSpGetPersonaRequired: procedureDoc(
    "GS_SP_GET_PERSONA_REQUIRED",
    `CREATE PROCEDURE GS_SP_GET_PERSONA_REQUIRED
(
    IN P_ID_PERSONA INT
)
BEGIN
    DECLARE V_EXISTE INT DEFAULT 0;

    SELECT COUNT(*) INTO V_EXISTE
    FROM GS_PERSONA
    WHERE ID_PERSONA = P_ID_PERSONA;

    IF V_EXISTE = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Persona no encontrada';
    END IF;

    SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO
    FROM GS_PERSONA
    WHERE ID_PERSONA = P_ID_PERSONA;
END`,
    ["inParameters", "errorPath"]
  ),
  gsSpUpdateMysqlTiposExtra: procedureDoc(
    "GS_SP_UPDATE_MYSQL_TIPOS_EXTRA",
    `CREATE PROCEDURE GS_SP_UPDATE_MYSQL_TIPOS_EXTRA
(
    IN P_ID_PERSONA INT,
    IN P_SALARIO DECIMAL(12,2),
    IN P_BIO TEXT,
    IN P_ULTIMO_ACCESO TIMESTAMP,
    IN P_HORA_CONTACTO TIME,
    IN P_FOTO VARBINARY(255),
    IN P_PERFIL_JSON JSON,
    OUT P_FILAS_AFECTADAS INT
)
BEGIN
    UPDATE GS_MYSQL_TIPOS_EXTRA
       SET SALARIO = P_SALARIO,
           BIO = P_BIO,
           ULTIMO_ACCESO = P_ULTIMO_ACCESO,
           HORA_CONTACTO = P_HORA_CONTACTO,
           FOTO = P_FOTO,
           PERFIL_JSON = P_PERFIL_JSON
     WHERE ID_PERSONA = P_ID_PERSONA;
    SET P_FILAS_AFECTADAS = ROW_COUNT();
END`,
    ["inParameters", "outputParameters", "update", "json", "blob", "extraTypes"]
  ),
  gsFnDeletePersona: functionDoc(
    "GS_FN_DELETE_PERSONA",
    `CREATE FUNCTION GS_FN_DELETE_PERSONA
(
    P_ID_PERSONA INT
)
RETURNS INT
MODIFIES SQL DATA
BEGIN
    DELETE FROM GS_PERSONA WHERE ID_PERSONA = P_ID_PERSONA;
    RETURN ROW_COUNT();
END`,
    ["inParameters", "delete", "scalarReturn"]
  ),
  fnPersonaJson: functionDoc(
    "fn_persona_json",
    `CREATE FUNCTION fn_persona_json
(
    P_ID INT
)
RETURNS JSON
DETERMINISTIC
BEGIN
  DECLARE v_nombre VARCHAR(100);
  DECLARE v_apellido VARCHAR(100);

  SELECT nombre, APELLIDO
    INTO v_nombre, v_apellido
    FROM GS_PERSONA
   WHERE ID_PERSONA = P_ID;

    RETURN JSON_OBJECT('id', P_ID, 'nombre', v_nombre, 'apellido', v_apellido);
END`,
    ["inParameters", "json", "naturalJson", "scalarReturn"]
  ),
  gsFnGetPersonaNombre: functionDoc(
    "GS_FN_GET_PERSONA_NOMBRE",
    `CREATE FUNCTION GS_FN_GET_PERSONA_NOMBRE(P_ID_PERSONA INT)
RETURNS VARCHAR(250)
READS SQL DATA`,
    ["inParameters", "scalarReturn"]
  ),
  gsFnGetPersonaFechaNacimiento: functionDoc(
    "GS_FN_GET_PERSONA_FECHA_NACIMIENTO",
    `CREATE FUNCTION GS_FN_GET_PERSONA_FECHA_NACIMIENTO(P_ID_PERSONA INT)
RETURNS DATE
READS SQL DATA`,
    ["inParameters", "scalarReturn"]
  ),
  gsFnGetPersonaFechaRegistro: functionDoc(
    "GS_FN_GET_PERSONA_FECHA_REGISTRO",
    `CREATE FUNCTION GS_FN_GET_PERSONA_FECHA_REGISTRO(P_ID_PERSONA INT)
RETURNS DATETIME
READS SQL DATA`,
    ["inParameters", "scalarReturn"]
  ),
  gsFnGetMysqlTiposExtraSalario: functionDoc(
    "GS_FN_GET_MYSQL_TIPOS_EXTRA_SALARIO",
    `CREATE FUNCTION GS_FN_GET_MYSQL_TIPOS_EXTRA_SALARIO(P_ID_PERSONA INT)
RETURNS DECIMAL(12,2)
READS SQL DATA`,
    ["inParameters", "scalarReturn", "extraTypes"]
  ),
  gsFnGetMysqlTiposExtraHoraContacto: functionDoc(
    "GS_FN_GET_MYSQL_TIPOS_EXTRA_HORA_CONTACTO",
    `CREATE FUNCTION GS_FN_GET_MYSQL_TIPOS_EXTRA_HORA_CONTACTO(P_ID_PERSONA INT)
RETURNS TIME
READS SQL DATA`,
    ["inParameters", "scalarReturn", "extraTypes"]
  ),
  gsFnGetMysqlTiposExtraBio: functionDoc(
    "GS_FN_GET_MYSQL_TIPOS_EXTRA_BIO",
    `CREATE FUNCTION GS_FN_GET_MYSQL_TIPOS_EXTRA_BIO(P_ID_PERSONA INT)
RETURNS TEXT
READS SQL DATA`,
    ["inParameters", "scalarReturn", "extraTypes"]
  ),
  gsFnCountPersonas: functionDoc(
    "GS_FN_COUNT_PERSONAS",
    `CREATE FUNCTION GS_FN_COUNT_PERSONAS()
RETURNS INT
READS SQL DATA`,
    ["aggregate", "scalarReturn"]
  ),
  gsFnInsertPersonasJson: functionDoc(
    "GS_FN_INSERT_PERSONAS_JSON",
    `CREATE FUNCTION GS_FN_INSERT_PERSONAS_JSON
(
    P_PERSONAS JSON
)
RETURNS INT
MODIFIES SQL DATA
BEGIN
    WHILE V_INDEX < JSON_LENGTH(P_PERSONAS) DO
    SET V_ACTIVO = CASE LOWER(JSON_UNQUOTE(JSON_EXTRACT(P_PERSONAS, CONCAT('$[', V_INDEX, '].activo'))))
      WHEN 'true' THEN TRUE
      WHEN '1' THEN TRUE
      ELSE FALSE
    END;
    INSERT INTO GS_PERSONA (..., ACTIVO) VALUES (..., V_ACTIVO);
        SET V_INDEX = V_INDEX + 1;
    END WHILE;
    RETURN LAST_INSERT_ID();
END`,
    ["inParameters", "json", "naturalJson", "insert", "scalarReturn"]
  ),
  gsFnUpdatePersona: functionDoc(
    "GS_FN_UPDATE_PERSONA",
    `CREATE FUNCTION GS_FN_UPDATE_PERSONA
(
    P_ID_PERSONA INT,
    P_NOMBRE VARCHAR(100),
    P_APELLIDO VARCHAR(100),
    P_EDAD INT,
    P_EMAIL VARCHAR(150),
    P_FECHA_NACIMIENTO DATE,
    P_ACTIVO BOOLEAN
)
RETURNS BOOLEAN
MODIFIES SQL DATA`,
    ["inParameters", "update", "scalarReturn"]
  ),
  gsQPersonaById: queryDoc(
    "GS_Q_PERSONA_BY_ID",
    "SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO FROM GS_PERSONA WHERE ID_PERSONA = :id_persona;",
    ["select", "inParameters", "resultSet"]
  ),
  gsQMysqlTiposExtraByPersona: queryDoc(
    "GS_Q_MYSQL_TIPOS_EXTRA_BY_PERSONA",
    "SELECT ID_EXTRA, ID_PERSONA, SALARIO, BIO, ULTIMO_ACCESO, HORA_CONTACTO, FOTO, PERFIL_JSON FROM GS_MYSQL_TIPOS_EXTRA WHERE ID_PERSONA = :id_persona;",
    ["select", "inParameters", "json", "blob", "extraTypes"]
  ),
  gsQPersonasByNombre: queryDoc(
    "GS_Q_PERSONAS_BY_NOMBRE",
    "SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO FROM GS_PERSONA WHERE NOMBRE LIKE CONCAT('%', :nombre, '%') ORDER BY ID_PERSONA;",
    ["select", "inParameters"]
  ),
  gsQPersonasByActivo: queryDoc(
    "GS_Q_PERSONAS_BY_ACTIVO",
    "SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad, EMAIL AS email, ACTIVO AS activo FROM GS_PERSONA WHERE ACTIVO = :activo ORDER BY ID_PERSONA;",
    ["select", "inParameters"]
  ),
  gsQPersonasSelfJoinActivo: queryDoc(
    "GS_Q_PERSONAS_SELF_JOIN_ACTIVO",
    "SELECT P.ID_PERSONA AS persona_id, P.NOMBRE AS nombre, P.APELLIDO AS apellido, R.ID_PERSONA AS referencia_id, R.ACTIVO AS activo_referencia FROM GS_PERSONA P JOIN GS_PERSONA R ON R.ACTIVO = P.ACTIVO WHERE R.ID_PERSONA = :id_persona_referencia ORDER BY P.ID_PERSONA;",
    ["select", "join", "inParameters"]
  ),
  gsQPersonasActivasWith: queryDoc(
    "GS_Q_PERSONAS_ACTIVAS_WITH",
    "WITH PERSONAS_FILTRADAS AS (SELECT ID_PERSONA, NOMBRE, APELLIDO, ACTIVO FROM GS_PERSONA WHERE ACTIVO = :activo) SELECT ID_PERSONA, NOMBRE, APELLIDO, ACTIVO FROM PERSONAS_FILTRADAS ORDER BY ID_PERSONA;",
    ["select", "with", "inParameters"]
  ),
  gsQPersonasStatsExtraWith: queryDoc(
    "GS_Q_PERSONAS_STATS_EXTRA_WITH",
    "WITH PERSONAS_FILTRADAS AS (SELECT P.ID_PERSONA, P.EDAD, E.SALARIO FROM GS_PERSONA P LEFT JOIN GS_MYSQL_TIPOS_EXTRA E ON E.ID_PERSONA = P.ID_PERSONA WHERE P.ACTIVO = :activo) SELECT COUNT(*) AS total_personas, COALESCE(AVG(EDAD), 0) AS edad_promedio, COALESCE(SUM(SALARIO), 0) AS salario_total FROM PERSONAS_FILTRADAS;",
    ["select", "with", "join", "aggregate", "inParameters", "extraTypes"]
  ),
  gsQMysqlTiposExtraByPerfilJson: queryDoc(
    "GS_Q_MYSQL_TIPOS_EXTRA_BY_PERFIL_JSON",
    "SELECT P.ID_PERSONA, P.NOMBRE, P.APELLIDO, JSON_UNQUOTE(JSON_EXTRACT(E.PERFIL_JSON, '$.nivel')) AS nivel, E.PERFIL_JSON FROM GS_PERSONA P JOIN GS_MYSQL_TIPOS_EXTRA E ON E.ID_PERSONA = P.ID_PERSONA WHERE JSON_UNQUOTE(JSON_EXTRACT(E.PERFIL_JSON, '$.nivel')) = :nivel ORDER BY P.ID_PERSONA;",
    ["select", "join", "json", "naturalJson", "inParameters"]
  ),
  gsQInsertPersona: queryDoc(
    "GS_Q_INSERT_PERSONA",
    "INSERT INTO GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO) VALUES (:nombre, :apellido, :edad, :email, :fecha_nacimiento, :activo);",
    ["insert", "dml", "inParameters"]
  ),
  gsQInsertPersonaSelect: queryDoc(
    "GS_Q_INSERT_PERSONA_SELECT",
    "INSERT INTO GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO) SELECT :nombre, P.APELLIDO, P.EDAD, :email, P.FECHA_NACIMIENTO, :activo FROM GS_PERSONA P WHERE P.ID_PERSONA = :id_persona_base;",
    ["insert", "select", "dml", "inParameters"]
  ),
  gsQUpdatePersona: queryDoc(
    "GS_Q_UPDATE_PERSONA",
    "UPDATE GS_PERSONA SET NOMBRE = :nombre, APELLIDO = :apellido, EDAD = :edad, EMAIL = :email, FECHA_NACIMIENTO = :fecha_nacimiento, ACTIVO = :activo WHERE ID_PERSONA = :id_persona;",
    ["update", "dml", "inParameters"]
  ),
  gsQUpdateMysqlTiposExtra: queryDoc(
    "GS_Q_UPDATE_MYSQL_TIPOS_EXTRA",
    "UPDATE GS_MYSQL_TIPOS_EXTRA SET SALARIO = :salario, BIO = :bio, ULTIMO_ACCESO = :ultimo_acceso, HORA_CONTACTO = :hora_contacto, FOTO = :foto, PERFIL_JSON = :perfil_json WHERE ID_PERSONA = :id_persona;",
    ["update", "dml", "json", "blob", "extraTypes", "inParameters"]
  ),
  gsQDeletePersona: queryDoc(
    "GS_Q_DELETE_PERSONA",
    "DELETE FROM GS_PERSONA WHERE ID_PERSONA = :id_persona;",
    ["delete", "dml", "inParameters"]
  )
};
