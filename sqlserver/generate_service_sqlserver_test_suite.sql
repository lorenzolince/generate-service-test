IF OBJECT_ID('dbo.GS_PERSONA', 'U') IS NOT NULL
    DROP TABLE dbo.GS_PERSONA;
GO

CREATE TABLE dbo.GS_PERSONA
(
    ID_PERSONA       INT IDENTITY(1,1) NOT NULL,
    NOMBRE           VARCHAR(100) NOT NULL,
    APELLIDO         VARCHAR(100) NOT NULL,
    EDAD             INT NULL,
    EMAIL            VARCHAR(150) NULL,
    FECHA_NACIMIENTO DATE NULL,
    ACTIVO           BIT NOT NULL DEFAULT 1,
    FECHA_REGISTRO   DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT PK_GS_PERSONA
        PRIMARY KEY (ID_PERSONA)
);
GO

IF TYPE_ID(N'dbo.GS_PERSONA_TYPE') IS NOT NULL
    DROP TYPE dbo.GS_PERSONA_TYPE;
GO

CREATE TYPE dbo.GS_PERSONA_TYPE AS TABLE
(
    NOMBRE           VARCHAR(100) NOT NULL,
    APELLIDO         VARCHAR(100) NOT NULL,
    EDAD             INT NULL,
    EMAIL            VARCHAR(150) NULL,
    FECHA_NACIMIENTO DATE NULL,
    ACTIVO           BIT NOT NULL
);
GO

INSERT INTO dbo.GS_PERSONA
(
    NOMBRE,
    APELLIDO,
    EDAD,
    EMAIL,
    FECHA_NACIMIENTO,
    ACTIVO
)
VALUES
    ('Alejandro', 'Mendoza', 35, 'alejandro.mendoza@test.com', CONVERT(DATE, '19910218', 112), 1),
    ('Carlos', 'Navarro', 44, 'carlos.navarro@test.com', CONVERT(DATE, '19820711', 112), 1),
    ('Sofia', 'Castillo', 26, 'sofia.castillo@test.com', CONVERT(DATE, '20000129', 112), 0),
    ('Ricardo', 'Vega', 38, 'ricardo.vega@test.com', CONVERT(DATE, '19881105', 112), 1),
    ('Gabriela', 'Torres', 29, 'gabriela.torres@test.com', CONVERT(DATE, '19970622', 112), 0);
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONA
    @P_ID_PERSONA INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ID_PERSONA,
        NOMBRE,
        APELLIDO,
        EDAD,
        EMAIL,
        FECHA_NACIMIENTO,
        ACTIVO,
        FECHA_REGISTRO
    FROM dbo.GS_PERSONA
    WHERE ID_PERSONA = @P_ID_PERSONA;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONAS
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ID_PERSONA,
        NOMBRE,
        APELLIDO,
        EDAD,
        EMAIL,
        FECHA_NACIMIENTO,
        ACTIVO,
        FECHA_REGISTRO
    FROM dbo.GS_PERSONA
    ORDER BY ID_PERSONA;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_INSERT_PERSONA
    @P_NOMBRE           VARCHAR(100),
    @P_APELLIDO         VARCHAR(100),
    @P_EDAD             INT,
    @P_EMAIL            VARCHAR(150),
    @P_FECHA_NACIMIENTO DATE,
    @P_ACTIVO           BIT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.GS_PERSONA
    (
        NOMBRE,
        APELLIDO,
        EDAD,
        EMAIL,
        FECHA_NACIMIENTO,
        ACTIVO
    )
    VALUES
    (
        @P_NOMBRE,
        @P_APELLIDO,
        @P_EDAD,
        @P_EMAIL,
        @P_FECHA_NACIMIENTO,
        @P_ACTIVO
    );

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS ID_PERSONA;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_UPDATE_PERSONA
    @P_ID_PERSONA       INT,
    @P_NOMBRE           VARCHAR(100),
    @P_APELLIDO         VARCHAR(100),
    @P_EDAD             INT,
    @P_EMAIL            VARCHAR(150),
    @P_FECHA_NACIMIENTO DATE,
    @P_ACTIVO           BIT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.GS_PERSONA
       SET NOMBRE = @P_NOMBRE,
           APELLIDO = @P_APELLIDO,
           EDAD = @P_EDAD,
           EMAIL = @P_EMAIL,
           FECHA_NACIMIENTO = @P_FECHA_NACIMIENTO,
           ACTIVO = @P_ACTIVO
     WHERE ID_PERSONA = @P_ID_PERSONA;

    SELECT
        CAST(
            CASE
                WHEN @@ROWCOUNT > 0 THEN 1
                ELSE 0
            END
            AS BIT
        ) AS RESULTADO;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_DELETE_PERSONA
    @P_ID_PERSONA INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.GS_PERSONA
    WHERE ID_PERSONA = @P_ID_PERSONA;

    SELECT
        CAST(
            CASE
                WHEN @@ROWCOUNT > 0 THEN 1
                ELSE 0
            END
            AS BIT
        ) AS RESULTADO;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_INSERT_PERSONAS
    @P_PERSONAS dbo.GS_PERSONA_TYPE READONLY
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.GS_PERSONA
    (
        NOMBRE,
        APELLIDO,
        EDAD,
        EMAIL,
        FECHA_NACIMIENTO,
        ACTIVO
    )
    SELECT
        NOMBRE,
        APELLIDO,
        EDAD,
        EMAIL,
        FECHA_NACIMIENTO,
        ACTIVO
    FROM @P_PERSONAS;

END;
GO

CREATE OR ALTER FUNCTION dbo.GS_FN_PERSONA_ACTIVA
(
    @P_ID_PERSONA INT
)
RETURNS BIT
AS
BEGIN

    DECLARE @RESULTADO BIT;

    SELECT @RESULTADO = ACTIVO
    FROM dbo.GS_PERSONA
    WHERE ID_PERSONA = @P_ID_PERSONA;

    RETURN ISNULL(@RESULTADO, 0);

END;
GO

CREATE OR ALTER FUNCTION dbo.GS_FN_PERSONA_EDAD
(
    @P_ID_PERSONA INT
)
RETURNS INT
AS
BEGIN

    DECLARE @EDAD INT;

    SELECT @EDAD = EDAD
    FROM dbo.GS_PERSONA
    WHERE ID_PERSONA = @P_ID_PERSONA;

    RETURN ISNULL(@EDAD, 0);

END;
GO

CREATE OR ALTER FUNCTION dbo.GS_IF_PERSONAS_BY_ESTADO
(
    @P_ACTIVO BIT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        ID_PERSONA,
        NOMBRE,
        APELLIDO,
        EDAD,
        EMAIL,
        FECHA_NACIMIENTO,
        ACTIVO,
        FECHA_REGISTRO
    FROM dbo.GS_PERSONA
    WHERE ACTIVO = @P_ACTIVO
);
GO

CREATE OR ALTER FUNCTION dbo.GS_IF_PERSONAS_BY_EDAD
(
    @P_EDAD_MINIMA INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        ID_PERSONA AS persona_id,
        CONCAT(NOMBRE, ' ', APELLIDO) AS nombre_completo,
        EDAD AS edad,
        EMAIL AS correo,
        ACTIVO AS estado,
        FECHA_REGISTRO AS fecha_alta
    FROM dbo.GS_PERSONA
    WHERE EDAD >= @P_EDAD_MINIMA
);
GO

CREATE OR ALTER FUNCTION dbo.GS_FN_PERSONA_FECHA_REGISTRO
(
    @P_ID_PERSONA INT
)
RETURNS DATETIME
AS
BEGIN

    DECLARE @FECHA DATETIME;

    SELECT @FECHA = FECHA_REGISTRO
    FROM dbo.GS_PERSONA
    WHERE ID_PERSONA = @P_ID_PERSONA;

    RETURN @FECHA;

END;
GO

CREATE OR ALTER FUNCTION dbo.GS_FN_PERSONA_FECHA_NACIMIENTO
(
    @P_ID_PERSONA INT
)
RETURNS DATE
AS
BEGIN

    DECLARE @FECHA_NACIMIENTO DATE;

    SELECT @FECHA_NACIMIENTO = FECHA_NACIMIENTO
    FROM dbo.GS_PERSONA
    WHERE ID_PERSONA = @P_ID_PERSONA;

    RETURN @FECHA_NACIMIENTO;

END;
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONA_OUT
    @P_ID_PERSONA INT,
    @P_NOMBRE VARCHAR(100) OUTPUT,
    @P_EDAD INT OUTPUT,
    @P_ACTIVO BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        @P_NOMBRE = NOMBRE,
        @P_EDAD = EDAD,
        @P_ACTIVO = ACTIVO
    FROM dbo.GS_PERSONA
    WHERE ID_PERSONA = @P_ID_PERSONA;
END;
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_TEST_OUT
    @P_VALOR INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SET @P_VALOR = ABS(CHECKSUM(NEWID())) % 100 + 1;
END;
GO

IF TYPE_ID(N'dbo.JSON') IS NULL
    EXEC(N'CREATE TYPE dbo.JSON FROM NVARCHAR(MAX) NULL');
GO
CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONA_JSON
    @P_ID_PERSONA INT,
    @P_PERSONA dbo.JSON OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        @P_PERSONA = (
            SELECT
                ID_PERSONA AS idPersona,
                NOMBRE AS nombre,
                APELLIDO AS apellido,
                EDAD AS edad,
                EMAIL AS email,
                FECHA_NACIMIENTO AS fechaNacimiento,
                ACTIVO AS activo,
                FECHA_REGISTRO AS fechaRegistro
            FROM dbo.GS_PERSONA
            WHERE ID_PERSONA = @P_ID_PERSONA
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        );
END;
GO


CREATE OR ALTER PROCEDURE dbo.GS_SP_GET_PERSONAS_JSON
    @P_PERSONAS dbo.JSON OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT @P_PERSONAS = (
        SELECT
            ID_PERSONA AS idPersona,
            NOMBRE AS nombre,
            APELLIDO AS apellido,
            EDAD AS edad,
            EMAIL AS email,
            FECHA_NACIMIENTO AS fechaNacimiento,
            ACTIVO AS activo,
            FECHA_REGISTRO AS fechaRegistro
        FROM dbo.GS_PERSONA
        ORDER BY ID_PERSONA
        FOR JSON PATH
    );
END;
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_INSERT_PERSONA_JSON
    @P_PERSONA dbo.JSON,
    @P_ID_PERSONA INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF ISJSON(@P_PERSONA) <> 1 OR LEFT(LTRIM(@P_PERSONA), 1) <> '{'
        THROW 50001, 'P_PERSONA debe ser un objeto JSON.', 1;

    INSERT INTO dbo.GS_PERSONA
    (
        NOMBRE,
        APELLIDO,
        EDAD,
        EMAIL,
        FECHA_NACIMIENTO,
        ACTIVO
    )
    SELECT
        NOMBRE,
        APELLIDO,
        EDAD,
        EMAIL,
        FECHA_NACIMIENTO,
        ISNULL(ACTIVO, 1)
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
END;
GO

CREATE OR ALTER PROCEDURE dbo.GS_SP_INSERT_PERSONAS_JSON
    @P_PERSONAS dbo.JSON,
    @P_INSERTADOS INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF ISJSON(@P_PERSONAS) <> 1 OR LEFT(LTRIM(@P_PERSONAS), 1) <> '['
        THROW 50002, 'P_PERSONAS debe ser un arreglo JSON.', 1;

    INSERT INTO dbo.GS_PERSONA
    (
        NOMBRE,
        APELLIDO,
        EDAD,
        EMAIL,
        FECHA_NACIMIENTO,
        ACTIVO
    )
    SELECT
        NOMBRE,
        APELLIDO,
        EDAD,
        EMAIL,
        FECHA_NACIMIENTO,
        ISNULL(ACTIVO, 1)
    FROM OPENJSON(@P_PERSONAS)
    WITH
    (
        NOMBRE VARCHAR(100) '$.nombre',
        APELLIDO VARCHAR(100) '$.apellido',
        EDAD INT '$.edad',
        EMAIL VARCHAR(150) '$.email',
        FECHA_NACIMIENTO DATE '$.fechaNacimiento',
        ACTIVO BIT '$.activo'
    );

    SET @P_INSERTADOS = @@ROWCOUNT;
END;
GO

/*
EXEC sys.sp_addextendedproperty
    @name = N'GS_LOGICAL_TYPE',
    @value = N'JSON:Persona',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'PROCEDURE',
    @level1name = N'GS_SP_GET_PERSONA_JSON',
    @level2type = N'PARAMETER',
    @level2name = N'@P_PERSONA';
	*/

/*
	EXEC sys.sp_updateextendedproperty
    @name = N'JSON',
    @value = N'{
        "fields": [
            { "name": "idPersona", "type": "Integer", "position": 1 },
            { "name": "nombre", "type": "String", "position": 2 },
            { "name": "apellido", "type": "String", "position": 3 },
            { "name": "edad", "type": "Integer", "position": 4 },
            { "name": "email", "type": "String", "position": 5 },
            { "name": "fechaNacimiento", "type": "Date", "position": 6 },
            { "name": "activo", "type": "Boolean", "position": 7 },
            { "name": "fechaRegistro", "type": "Timestamp", "position": 8 }
        ]
    }',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'PROCEDURE',
    @level1name = N'GS_SP_GET_PERSONA_JSON',
    @level2type = N'PARAMETER',
    @level2name = N'@P_PERSONA';
GO
*/

CREATE OR ALTER FUNCTION dbo.GS_FN_GET_PERSONA_JSON
(
    @P_ID_PERSONA INT
)
RETURNS dbo.JSON
AS
BEGIN
    DECLARE @P_PERSONA dbo.JSON;

    SELECT
        @P_PERSONA = (
            SELECT
                ID_PERSONA AS idPersona,
                NOMBRE AS nombre,
                APELLIDO AS apellido,
                EDAD AS edad,
                EMAIL AS email,
                FECHA_NACIMIENTO AS fechaNacimiento,
                ACTIVO AS activo,
                FECHA_REGISTRO AS fechaRegistro
            FROM dbo.GS_PERSONA
            WHERE ID_PERSONA = @P_ID_PERSONA
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        );

    RETURN @P_PERSONA;
END;
GO

CREATE OR ALTER FUNCTION dbo.GS_FN_GET_PERSONAS_JSON()
RETURNS dbo.JSON
AS
BEGIN
    DECLARE @P_PERSONAS dbo.JSON;

    SELECT
        @P_PERSONAS = (
            SELECT
                ID_PERSONA AS idPersona,
                NOMBRE AS nombre,
                APELLIDO AS apellido,
                EDAD AS edad,
                EMAIL AS email,
                FECHA_NACIMIENTO AS fechaNacimiento,
                ACTIVO AS activo,
                FECHA_REGISTRO AS fechaRegistro
            FROM dbo.GS_PERSONA
            ORDER BY ID_PERSONA
            FOR JSON PATH
        );

    RETURN @P_PERSONAS;
END;
GO

CREATE OR ALTER FUNCTION dbo.GS_IF_PERSONAS_BY_JSON
(
    @P_PERSONAS dbo.JSON
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        P.ID_PERSONA,
        P.NOMBRE,
        P.APELLIDO,
        P.EDAD,
        P.EMAIL,
        P.FECHA_NACIMIENTO,
        P.ACTIVO,
        P.FECHA_REGISTRO
    FROM OPENJSON(
        CASE
            WHEN ISJSON(@P_PERSONAS) = 1 THEN CONVERT(NVARCHAR(MAX), @P_PERSONAS)
            ELSE N'[]'
        END
    )
    WITH
    (
        ID_PERSONA INT '$.idPersona'
    ) J
    INNER JOIN dbo.GS_PERSONA P
        ON P.ID_PERSONA = J.ID_PERSONA
);
GO


-- =========================================================
-- ESCENARIOS ADICIONALES SQLSERVER
-- =========================================================

CREATE OR ALTER PROCEDURE dbo.GS_SP_MULTI_RESULT_PERSONA
    @P_ACTIVO BIT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ID_PERSONA AS persona_id,
        NOMBRE AS nombre,
        APELLIDO AS apellido,
        EDAD AS edad,
        ACTIVO AS activo
    FROM dbo.GS_PERSONA
    WHERE ACTIVO = @P_ACTIVO
    ORDER BY ID_PERSONA;

    SELECT
        COUNT(*) AS total_personas,
        COALESCE(AVG(CAST(EDAD AS DECIMAL(10,2))), 0) AS edad_promedio,
        COALESCE(MIN(EDAD), 0) AS edad_minima,
        COALESCE(MAX(EDAD), 0) AS edad_maxima
    FROM dbo.GS_PERSONA
    WHERE ACTIVO = @P_ACTIVO;
END;
GO


-- =========================================================
-- QUERIES GENERATE SERVICE SQLSERVER
-- =========================================================
-- Copiar la linea SQL en el generador. Los parametros usan sintaxis :name.

-- GS_Q_PERSONA_BY_ID
-- SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO FROM dbo.GS_PERSONA WHERE ID_PERSONA = :id_persona;

-- GS_Q_PERSONAS_BY_NOMBRE
-- SELECT ID_PERSONA, NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO, FECHA_REGISTRO FROM dbo.GS_PERSONA WHERE NOMBRE LIKE CONCAT('%', :nombre, '%') ORDER BY ID_PERSONA;

-- GS_Q_PERSONAS_BY_ACTIVO
-- SELECT ID_PERSONA AS persona_id, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad, EMAIL AS email, ACTIVO AS activo FROM dbo.GS_PERSONA WHERE ACTIVO = :activo ORDER BY ID_PERSONA;

-- GS_Q_PERSONAS_SELF_JOIN_ACTIVO
-- SELECT P.ID_PERSONA AS persona_id, P.NOMBRE AS nombre, P.APELLIDO AS apellido, R.ID_PERSONA AS referencia_id, R.ACTIVO AS activo_referencia FROM dbo.GS_PERSONA P INNER JOIN dbo.GS_PERSONA R ON R.ACTIVO = P.ACTIVO WHERE R.ID_PERSONA = :id_persona_referencia ORDER BY P.ID_PERSONA;

-- GS_Q_PERSONAS_ACTIVAS_WITH
-- WITH PERSONAS_FILTRADAS AS (SELECT ID_PERSONA, NOMBRE, APELLIDO, ACTIVO FROM dbo.GS_PERSONA WHERE ACTIVO = :activo) SELECT ID_PERSONA, NOMBRE, APELLIDO, ACTIVO FROM PERSONAS_FILTRADAS ORDER BY ID_PERSONA;

-- GS_Q_PERSONAS_STATS_WITH
-- WITH PERSONAS_FILTRADAS AS (SELECT ID_PERSONA, EDAD, ACTIVO FROM dbo.GS_PERSONA WHERE ACTIVO = :activo) SELECT COUNT(*) AS total_personas, COALESCE(AVG(CAST(EDAD AS DECIMAL(10,2))), 0) AS edad_promedio, COALESCE(MIN(EDAD), 0) AS edad_minima, COALESCE(MAX(EDAD), 0) AS edad_maxima FROM PERSONAS_FILTRADAS;

-- GS_Q_PERSONAS_BY_JSON
-- SELECT P.ID_PERSONA, P.NOMBRE, P.APELLIDO, P.EDAD, P.EMAIL, P.FECHA_NACIMIENTO, P.ACTIVO, P.FECHA_REGISTRO FROM OPENJSON(CAST(:personas_json AS NVARCHAR(MAX))) WITH (ID_PERSONA INT '$.idPersona') J INNER JOIN dbo.GS_PERSONA P ON P.ID_PERSONA = J.ID_PERSONA ORDER BY P.ID_PERSONA;

-- GS_Q_PERSONAS_FOR_JSON
-- SELECT (SELECT ID_PERSONA AS idPersona, NOMBRE AS nombre, APELLIDO AS apellido, EDAD AS edad, EMAIL AS email, FECHA_NACIMIENTO AS fechaNacimiento, ACTIVO AS activo, FECHA_REGISTRO AS fechaRegistro FROM dbo.GS_PERSONA WHERE ACTIVO = :activo ORDER BY ID_PERSONA FOR JSON PATH) AS personas_json;

-- GS_Q_INSERT_PERSONA
-- INSERT INTO dbo.GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO) VALUES (:nombre, :apellido, :edad, :email, :fecha_nacimiento, :activo);

-- GS_Q_INSERT_PERSONA_SELECT
-- INSERT INTO dbo.GS_PERSONA (NOMBRE, APELLIDO, EDAD, EMAIL, FECHA_NACIMIENTO, ACTIVO) SELECT :nombre, P.APELLIDO, P.EDAD, :email, P.FECHA_NACIMIENTO, :activo FROM dbo.GS_PERSONA P WHERE P.ID_PERSONA = :id_persona_base;

-- GS_Q_UPDATE_PERSONA
-- UPDATE dbo.GS_PERSONA SET NOMBRE = :nombre, APELLIDO = :apellido, EDAD = :edad, EMAIL = :email, FECHA_NACIMIENTO = :fecha_nacimiento, ACTIVO = :activo WHERE ID_PERSONA = :id_persona;

-- GS_Q_DELETE_PERSONA
-- DELETE FROM dbo.GS_PERSONA WHERE ID_PERSONA = :id_persona;

