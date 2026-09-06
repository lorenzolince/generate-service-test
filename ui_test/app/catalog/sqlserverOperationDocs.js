export const SQLSERVER_OPERATION_DOCS = {
  gsSpGetPersona: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_GET_PERSONA",
    capabilities: ["procedure", "select", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONA
    @P_ID_PERSONA INT
AS
BEGIN
    SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO
    FROM dbo.GS_PERSONA
    WHERE ID_PERSONA = @P_ID_PERSONA;
END;`
  },
  gsSpGetPersonas: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_GET_PERSONAS",
    capabilities: ["procedure", "select", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONAS
AS
BEGIN
    SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO
    FROM dbo.GS_PERSONA
    ORDER BY ID_PERSONA;
END;`
  },
  gsSpInsertPersona: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_INSERT_PERSONA",
    capabilities: ["procedure", "insert", "identity", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_INSERT_PERSONA
    @P_NOMBRE VARCHAR(100),
    @P_APELLIDO VARCHAR(100),
    @P_EDAD INT,
    @P_EMAIL VARCHAR(150),
    @P_FECHA_NACIMIENTO DATE,
    @P_ACTIVO BIT
AS
BEGIN
    INSERT INTO dbo.GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO)
    VALUES (@P_NOMBRE, @P_APELLIDO, @P_EDAD, @P_EMAIL, @P_FECHA_NACIMIENTO, @P_ACTIVO);

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS ID_PERSONA;
END;`
  },
  gsSpUpdatePersona: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_UPDATE_PERSONA",
    capabilities: ["procedure", "update", "rowCount", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_UPDATE_PERSONA
    @P_ID_PERSONA INT,
    @P_NOMBRE VARCHAR(100),
    @P_APELLIDO VARCHAR(100),
    @P_EDAD INT,
    @P_EMAIL VARCHAR(150),
    @P_FECHA_NACIMIENTO DATE,
    @P_ACTIVO BIT
AS
BEGIN
    UPDATE dbo.GS_PERSONA
       SET NOMBRE = @P_NOMBRE,
           APELLIDO = @P_APELLIDO,
           EDAD = @P_EDAD,
           EMAIL = @P_EMAIL,
           FECHA_NACIMIENTO = @P_FECHA_NACIMIENTO,
           ACTIVO = @P_ACTIVO
     WHERE ID_PERSONA = @P_ID_PERSONA;

    SELECT CAST(CASE WHEN @@ROWCOUNT > 0 THEN 1 ELSE 0 END AS BIT) AS RESULTADO;
END;`
  },
  gsSpDeletePersona: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_DELETE_PERSONA",
    capabilities: ["procedure", "delete", "rowCount", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_DELETE_PERSONA
    @P_ID_PERSONA INT
AS
BEGIN
    DELETE FROM dbo.GS_PERSONA WHERE ID_PERSONA = @P_ID_PERSONA;
    SELECT CAST(CASE WHEN @@ROWCOUNT > 0 THEN 1 ELSE 0 END AS BIT) AS RESULTADO;
END;`
  },
  gsSpInsertPersonas: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_INSERT_PERSONAS",
    capabilities: ["procedure", "tableValuedParameter", "insert", "post"],
    source: `CREATE TYPE dbo.GS_PERSONA_TYPE AS TABLE
(
    NOMBRE VARCHAR(100), APELLIDO VARCHAR(100), EDAD INT,
    EMAIL VARCHAR(150), FECHA_NACIMIENTO DATE, ACTIVO BIT
);

CREATE OR ALTER PROCEDURE dbo.GS_SP_INSERT_PERSONAS
    @P_PERSONAS dbo.GS_PERSONA_TYPE READONLY
AS
BEGIN
    INSERT INTO dbo.GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO)
    SELECT NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO
    FROM @P_PERSONAS;
END;`
  },
  gsSpGetPersonaOut: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_GET_PERSONA_OUT",
    capabilities: ["procedure", "outputParameters", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONA_OUT
    @P_ID_PERSONA INT,
    @P_NOMBRE VARCHAR(100) OUTPUT,
    @P_EDAD INT OUTPUT,
    @P_ACTIVO BIT OUTPUT
AS
BEGIN
    SELECT @P_NOMBRE = NOMBRE, @P_EDAD = EDAD, @P_ACTIVO = ACTIVO
    FROM dbo.GS_PERSONA
    WHERE ID_PERSONA = @P_ID_PERSONA;
END;`
  },
  gsSpTestOut: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_TEST_OUT",
    capabilities: ["procedure", "outputParameters", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_TEST_OUT
    @P_VALOR INT OUTPUT
AS
BEGIN
    SET @P_VALOR = ABS(CHECKSUM(NEWID())) % 100 + 1;
END;`
  },
  gsSpGetPersonaJson: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_GET_PERSONA_JSON",
    capabilities: ["procedure", "customJsonAlias", "forJson", "dynamicJson", "post"],
    source: `IF TYPE_ID(N'dbo.JSON') IS NULL
    EXEC(N'CREATE TYPE dbo.JSON FROM NVARCHAR(MAX) NULL');
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONA_JSON
    @P_ID_PERSONA INT,
    @P_PERSONA dbo.JSON OUTPUT
AS
BEGIN
    SELECT @P_PERSONA = (
        SELECT ID_PERSONA AS idPersona, NOMBRE AS nombre, APELLIDO AS apellido,
               EDAD AS edad, EMAIL AS email, FECHA_NACIMIENTO AS fechaNacimiento,
               ACTIVO AS activo, FECHA_REGISTRO AS fechaRegistro
        FROM dbo.GS_PERSONA
        WHERE ID_PERSONA = @P_ID_PERSONA
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    );
END;`
  },
  gsSpGetPersonasJson: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_GET_PERSONAS_JSON",
    capabilities: ["procedure", "customJsonAlias", "forJson", "dynamicJson", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONAS_JSON
    @P_PERSONAS dbo.JSON OUTPUT
AS
BEGIN
    SELECT @P_PERSONAS = (
        SELECT ID_PERSONA AS idPersona, NOMBRE AS nombre, APELLIDO AS apellido,
               EDAD AS edad, EMAIL AS email, FECHA_NACIMIENTO AS fechaNacimiento,
               ACTIVO AS activo, FECHA_REGISTRO AS fechaRegistro
        FROM dbo.GS_PERSONA
        ORDER BY ID_PERSONA
        FOR JSON PATH
    );
END;`
  },
  gsSpInsertPersonaJson: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_INSERT_PERSONA_JSON",
    capabilities: ["procedure", "customJsonAlias", "openJson", "dynamicJson", "insert", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_INSERT_PERSONA_JSON
    @P_PERSONA dbo.JSON,
    @P_ID_PERSONA INT OUTPUT
AS
BEGIN
    INSERT INTO dbo.GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO)
    SELECT NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ISNULL(ACTIVO, 1)
    FROM OPENJSON(@P_PERSONA)
    WITH
    (
        NOMBRE VARCHAR(100) '$.nombre',
        APELLIDO VARCHAR(100) '$.apellido',
        EDAD INT '$.edad',
        EMAIL VARCHAR(150) '$.email',
        FECHA_NACIMIENTO DATE '$.fechaNacimiento',
        ACTIVO BIT '$.activo'
    );

    SET @P_ID_PERSONA = CAST(SCOPE_IDENTITY() AS INT);
END;`
  },
  gsSpInsertPersonasJson: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_INSERT_PERSONAS_JSON",
    capabilities: ["procedure", "customJsonAlias", "openJson", "dynamicJson", "insert", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_INSERT_PERSONAS_JSON
    @P_PERSONAS dbo.JSON,
    @P_INSERTADOS INT OUTPUT
AS
BEGIN
    INSERT INTO dbo.GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO)
    SELECT NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ISNULL(ACTIVO, 1)
    FROM OPENJSON(@P_PERSONAS)
    WITH
    (
        NOMBRE VARCHAR(100) '$.nombre', APELLIDO VARCHAR(100) '$.apellido',
        EDAD INT '$.edad', EMAIL VARCHAR(150) '$.email',
        FECHA_NACIMIENTO DATE '$.fechaNacimiento', ACTIVO BIT '$.activo'
    );

    SET @P_INSERTADOS = @@ROWCOUNT;
END;`
  },
  gsSpMultiResultPersona: {
    sourceType: "procedure",
    sourceName: "dbo.GS_SP_MULTI_RESULT_PERSONA",
    capabilities: ["procedure", "multiResultSet", "aggregate", "post"],
    source: `CREATE OR ALTER PROCEDURE dbo.GS_SP_MULTI_RESULT_PERSONA
    @P_ACTIVO BIT
AS
BEGIN
    SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad, ACTIVO AS activo
    FROM dbo.GS_PERSONA
    WHERE ACTIVO = @P_ACTIVO
    ORDER BY ID_PERSONA;

    SELECT COUNT(*) AS total_personas,
           COALESCE(AVG(CAST(EDAD AS DECIMAL(10,2))), 0) AS edad_promedio,
           COALESCE(MIN(EDAD), 0) AS edad_minima,
           COALESCE(MAX(EDAD), 0) AS edad_maxima
    FROM dbo.GS_PERSONA
    WHERE ACTIVO = @P_ACTIVO;
END;`
  },
  gsFnPersonaActiva: {
    sourceType: "scalarFunction",
    sourceName: "dbo.GS_FN_PERSONA_ACTIVA",
    capabilities: ["scalarFunction", "bitBoolean", "post"],
    source: `CREATE OR ALTER FUNCTION dbo.GS_FN_PERSONA_ACTIVA (@P_ID_PERSONA INT)
RETURNS BIT
AS
BEGIN
    DECLARE @RESULTADO BIT;
    SELECT @RESULTADO = ACTIVO FROM dbo.GS_PERSONA WHERE ID_PERSONA = @P_ID_PERSONA;
    RETURN ISNULL(@RESULTADO, 0);
END;`
  },
  gsFnPersonaEdad: {
    sourceType: "scalarFunction",
    sourceName: "dbo.GS_FN_PERSONA_EDAD",
    capabilities: ["scalarFunction", "numeric", "post"],
    source: `CREATE OR ALTER FUNCTION dbo.GS_FN_PERSONA_EDAD (@P_ID_PERSONA INT)
RETURNS INT
AS
BEGIN
    DECLARE @EDAD INT;
    SELECT @EDAD = EDAD FROM dbo.GS_PERSONA WHERE ID_PERSONA = @P_ID_PERSONA;
    RETURN ISNULL(@EDAD, 0);
END;`
  },
  gsFnPersonaFechaRegistro: {
    sourceType: "scalarFunction",
    sourceName: "dbo.GS_FN_PERSONA_FECHA_REGISTRO",
    capabilities: ["scalarFunction", "dateTime", "post"],
    source: `CREATE OR ALTER FUNCTION dbo.GS_FN_PERSONA_FECHA_REGISTRO (@P_ID_PERSONA INT)
RETURNS DATETIME
AS
BEGIN
    DECLARE @FECHA DATETIME;
    SELECT @FECHA = FECHA_REGISTRO FROM dbo.GS_PERSONA WHERE ID_PERSONA = @P_ID_PERSONA;
    RETURN @FECHA;
END;`
  },
  gsFnPersonaFechaNacimiento: {
    sourceType: "scalarFunction",
    sourceName: "dbo.GS_FN_PERSONA_FECHA_NACIMIENTO",
    capabilities: ["scalarFunction", "date", "post"],
    source: `CREATE OR ALTER FUNCTION dbo.GS_FN_PERSONA_FECHA_NACIMIENTO (@P_ID_PERSONA INT)
RETURNS DATE
AS
BEGIN
    DECLARE @FECHA_NACIMIENTO DATE;
    SELECT @FECHA_NACIMIENTO = FECHA_NACIMIENTO FROM dbo.GS_PERSONA WHERE ID_PERSONA = @P_ID_PERSONA;
    RETURN @FECHA_NACIMIENTO;
END;`
  },
  gsFnGetPersonaJson: {
    sourceType: "scalarFunction",
    sourceName: "dbo.GS_FN_GET_PERSONA_JSON",
    capabilities: ["scalarFunction", "customJsonAlias", "forJson", "dynamicJson", "post"],
    source: `CREATE OR ALTER FUNCTION dbo.GS_FN_GET_PERSONA_JSON (@P_ID_PERSONA INT)
RETURNS dbo.JSON
AS
BEGIN
    DECLARE @P_PERSONA dbo.JSON;
    SELECT @P_PERSONA = (
        SELECT ID_PERSONA AS idPersona, NOMBRE AS nombre, APELLIDO AS apellido,
               EDAD AS edad, EMAIL AS email, FECHA_NACIMIENTO AS fechaNacimiento,
               ACTIVO AS activo, FECHA_REGISTRO AS fechaRegistro
        FROM dbo.GS_PERSONA
        WHERE ID_PERSONA = @P_ID_PERSONA
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    );
    RETURN @P_PERSONA;
END;`
  },
  gsFnGetPersonasJson: {
    sourceType: "scalarFunction",
    sourceName: "dbo.GS_FN_GET_PERSONAS_JSON",
    capabilities: ["scalarFunction", "customJsonAlias", "forJson", "dynamicJson", "post"],
    source: `CREATE OR ALTER FUNCTION dbo.GS_FN_GET_PERSONAS_JSON()
RETURNS dbo.JSON
AS
BEGIN
    DECLARE @P_PERSONAS dbo.JSON;
    SELECT @P_PERSONAS = (
        SELECT ID_PERSONA AS idPersona, NOMBRE AS nombre, APELLIDO AS apellido,
               EDAD AS edad, EMAIL AS email, FECHA_NACIMIENTO AS fechaNacimiento,
               ACTIVO AS activo, FECHA_REGISTRO AS fechaRegistro
        FROM dbo.GS_PERSONA
        ORDER BY ID_PERSONA
        FOR JSON PATH
    );
    RETURN @P_PERSONAS;
END;`
  },
  gsIfPersonasByEstado: {
    sourceType: "tableFunction",
    sourceName: "dbo.GS_IF_PERSONAS_BY_ESTADO",
    capabilities: ["tableFunction", "select", "post"],
    source: `CREATE OR ALTER FUNCTION dbo.GS_IF_PERSONAS_BY_ESTADO (@P_ACTIVO BIT)
RETURNS TABLE
AS
RETURN
(
    SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO
    FROM dbo.GS_PERSONA
    WHERE ACTIVO = @P_ACTIVO
);`
  },
  gsIfPersonasByEdad: {
    sourceType: "tableFunction",
    sourceName: "dbo.GS_IF_PERSONAS_BY_EDAD",
    capabilities: ["tableFunction", "aliasMapping", "post"],
    source: `CREATE OR ALTER FUNCTION dbo.GS_IF_PERSONAS_BY_EDAD (@P_EDAD_MINIMA INT)
RETURNS TABLE
AS
RETURN
(
    SELECT ID_PERSONA AS persona_id,
           CONCAT(NOMBRE, ' ', APELLIDO) AS nombre_completo,
           EDAD AS edad, EMAIL AS correo, ACTIVO AS estado, FECHA_REGISTRO AS fecha_alta
    FROM dbo.GS_PERSONA
    WHERE EDAD >= @P_EDAD_MINIMA
);`
  },
  gsIfPersonasByJson: {
    sourceType: "tableFunction",
    sourceName: "dbo.GS_IF_PERSONAS_BY_JSON",
    capabilities: ["tableFunction", "customJsonAlias", "openJson", "dynamicJson", "post"],
    source: `CREATE OR ALTER FUNCTION dbo.GS_IF_PERSONAS_BY_JSON (@P_PERSONAS dbo.JSON)
RETURNS TABLE
AS
RETURN
(
    SELECT P.ID_PERSONA, P.NOMBRE, P.APELLIDO, P.EDAD, P.EMAIL, P.FECHA_NACIMIENTO, P.ACTIVO, P.FECHA_REGISTRO
    FROM OPENJSON(CASE WHEN ISJSON(@P_PERSONAS) = 1 THEN CONVERT(NVARCHAR(MAX), @P_PERSONAS) ELSE N'[]' END)
    WITH (ID_PERSONA INT '$.idPersona') J
    INNER JOIN dbo.GS_PERSONA P ON P.ID_PERSONA = J.ID_PERSONA
);`
  },
  gsQPersonaById: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONA_BY_ID",
    capabilities: ["query", "select", "namedParameters", "post"],
    source: "SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO FROM dbo.GS_PERSONA WHERE ID_PERSONA = :id_persona;"
  },
  gsQPersonasByNombre: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_BY_NOMBRE",
    capabilities: ["query", "select", "namedParameters", "post"],
    source: "SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO FROM dbo.GS_PERSONA WHERE NOMBRE LIKE CONCAT('%', :nombre, '%') ORDER BY ID_PERSONA;"
  },
  gsQPersonasByActivo: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_BY_ACTIVO",
    capabilities: ["query", "select", "aliasMapping", "post"],
    source: "SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad, EMAIL AS email, ACTIVO AS activo FROM dbo.GS_PERSONA WHERE ACTIVO = :activo ORDER BY ID_PERSONA;"
  },
  gsQPersonasSelfJoinActivo: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_SELF_JOIN_ACTIVO",
    capabilities: ["query", "join", "aliasMapping", "post"],
    source: "SELECT P.ID_PERSONA AS persona_id, P.NOMBRE AS nombre, P.APELLIDO AS apellido, R.ID_PERSONA AS referencia_id, R.ACTIVO AS activo_referencia FROM dbo.GS_PERSONA P INNER JOIN dbo.GS_PERSONA R ON R.ACTIVO = P.ACTIVO WHERE R.ID_PERSONA = :id_persona_referencia ORDER BY P.ID_PERSONA;"
  },
  gsQPersonasActivasWith: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_ACTIVAS_WITH",
    capabilities: ["query", "cte", "select", "post"],
    source: "WITH PERSONAS_FILTRADAS AS (SELECT ID_PERSONA, NOMBRE, APELLIDO, ACTIVO FROM dbo.GS_PERSONA WHERE ACTIVO = :activo) SELECT ID_PERSONA, NOMBRE, APELLIDO, ACTIVO FROM PERSONAS_FILTRADAS ORDER BY ID_PERSONA;"
  },
  gsQPersonasStatsWith: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_STATS_WITH",
    capabilities: ["query", "cte", "aggregate", "post"],
    source: "WITH PERSONAS_FILTRADAS AS (SELECT ID_PERSONA, EDAD, ACTIVO FROM dbo.GS_PERSONA WHERE ACTIVO = :activo) SELECT COUNT(*) AS total_personas, COALESCE(AVG(CAST(EDAD AS DECIMAL(10,2))), 0) AS edad_promedio, COALESCE(MIN(EDAD), 0) AS edad_minima, COALESCE(MAX(EDAD), 0) AS edad_maxima FROM PERSONAS_FILTRADAS;"
  },
  gsQPersonasByJson: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_BY_JSON",
    capabilities: ["query", "openJson", "dynamicJson", "namedParameters", "post"],
    source: "SELECT P.ID_PERSONA, P.NOMBRE, P.APELLIDO, P.EDAD, P.EMAIL, P.FECHA_NACIMIENTO, P.ACTIVO, P.FECHA_REGISTRO FROM OPENJSON(CAST(:personas_json AS NVARCHAR(MAX))) WITH (ID_PERSONA INT '$.idPersona') J INNER JOIN dbo.GS_PERSONA P ON P.ID_PERSONA = J.ID_PERSONA ORDER BY P.ID_PERSONA;"
  },
  gsQPersonasForJson: {
    sourceType: "query",
    sourceName: "GS_Q_PERSONAS_FOR_JSON",
    capabilities: ["query", "forJson", "dynamicJson", "namedParameters", "post"],
    source: "SELECT (SELECT ID_PERSONA AS idPersona, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad, EMAIL AS email, FECHA_NACIMIENTO AS fechaNacimiento, ACTIVO AS activo, FECHA_REGISTRO AS fechaRegistro FROM dbo.GS_PERSONA WHERE ACTIVO = :activo ORDER BY ID_PERSONA FOR JSON PATH) AS personas_json;"
  },
  gsQInsertPersona: {
    sourceType: "query",
    sourceName: "GS_Q_INSERT_PERSONA",
    capabilities: ["query", "insert", "namedParameters", "post"],
    source: "INSERT INTO dbo.GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO) VALUES (:nombre, :apellido, :edad, :email, :fecha_nacimiento, :activo);"
  },
  gsQInsertPersonaSelect: {
    sourceType: "query",
    sourceName: "GS_Q_INSERT_PERSONA_SELECT",
    capabilities: ["query", "insert", "select", "namedParameters", "post"],
    source: "INSERT INTO dbo.GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO) SELECT :nombre, P.APELLIDO, P.EDAD, :email, P.FECHA_NACIMIENTO, :activo FROM dbo.GS_PERSONA P WHERE P.ID_PERSONA = :id_persona_base;"
  },
  gsQUpdatePersona: {
    sourceType: "query",
    sourceName: "GS_Q_UPDATE_PERSONA",
    capabilities: ["query", "update", "namedParameters", "post"],
    source: "UPDATE dbo.GS_PERSONA SET NOMBRE = :nombre, APELLIDO = :apellido, EDAD = :edad, EMAIL = :email, FECHA_NACIMIENTO = :fecha_nacimiento, ACTIVO = :activo WHERE ID_PERSONA = :id_persona;"
  },
  gsQDeletePersona: {
    sourceType: "query",
    sourceName: "GS_Q_DELETE_PERSONA",
    capabilities: ["query", "delete", "namedParameters", "post"],
    source: "DELETE FROM dbo.GS_PERSONA WHERE ID_PERSONA = :id_persona;"
  }
};