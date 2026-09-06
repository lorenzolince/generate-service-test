DROP TYPE IF EXISTS gs_persona_detalle_obj CASCADE;
DROP TYPE IF EXISTS gs_hijo_obj CASCADE;
DROP TYPE IF EXISTS gs_direccion_obj CASCADE;
DROP TYPE IF EXISTS gs_persona_obj CASCADE;
DROP TABLE IF EXISTS gs_hijo_direccion CASCADE;
DROP TABLE IF EXISTS gs_hijo CASCADE;
DROP TABLE IF EXISTS gs_persona_direccion CASCADE;
DROP TABLE IF EXISTS gs_persona CASCADE;
DROP TYPE IF EXISTS gs_persona_json_obj CASCADE;

CREATE TABLE gs_persona
(
    id_persona       SERIAL PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    apellido         VARCHAR(100) NOT NULL,
    edad             INTEGER NULL,
    email            VARCHAR(150) NULL,
    fecha_nacimiento DATE NULL,
    activo           BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gs_persona_direccion
(
    id_direccion SERIAL PRIMARY KEY,
    id_persona   INTEGER NOT NULL REFERENCES gs_persona(id_persona) ON DELETE CASCADE,
    pais         VARCHAR(100) NOT NULL,
    ciudad       VARCHAR(100) NOT NULL,
    telefono     VARCHAR(30) NULL,
    UNIQUE (id_persona)
);

CREATE TABLE gs_hijo
(
    id_hijo          SERIAL PRIMARY KEY,
    id_persona       INTEGER NOT NULL REFERENCES gs_persona(id_persona) ON DELETE CASCADE,
    nombre           VARCHAR(100) NOT NULL,
    apellido         VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NULL
);

CREATE TABLE gs_hijo_direccion
(
    id_direccion SERIAL PRIMARY KEY,
    id_hijo      INTEGER NOT NULL REFERENCES gs_hijo(id_hijo) ON DELETE CASCADE,
    pais         VARCHAR(100) NOT NULL,
    ciudad       VARCHAR(100) NOT NULL,
    telefono     VARCHAR(30) NULL,
    UNIQUE (id_hijo)
);

CREATE TYPE gs_persona_obj AS
(
    id_persona       INTEGER,
    nombre           VARCHAR(100),
    apellido         VARCHAR(100),
    edad             INTEGER,
    email            VARCHAR(150),
    fecha_nacimiento DATE,
    activo           BOOLEAN,
    fecha_registro   TIMESTAMP
);

CREATE TYPE gs_direccion_obj AS
(
    pais     VARCHAR(100),
    ciudad   VARCHAR(100),
    telefono VARCHAR(30)
);

CREATE TYPE gs_hijo_obj AS
(
    nombre           VARCHAR(100),
    apellido         VARCHAR(100),
    fecha_nacimiento DATE,
    direccion        gs_direccion_obj
);

CREATE TYPE gs_persona_detalle_obj AS
(
    id_persona       INTEGER,
    nombre           VARCHAR(100),
    apellido         VARCHAR(100),
    edad             INTEGER,
    email            VARCHAR(150),
    fecha_nacimiento DATE,
    activo           BOOLEAN,
    fecha_registro   TIMESTAMP,
    direccion        gs_direccion_obj,
    hijos            gs_hijo_obj[]
);

INSERT INTO gs_persona
(
    nombre,
    apellido,
    edad,
    email,
    fecha_nacimiento,
    activo
)
VALUES
    ('Alejandro', 'Mendoza', 35, 'alejandro.mendoza@test.com', DATE '1991-02-18', TRUE),
    ('Carlos', 'Navarro', 44, 'carlos.navarro@test.com', DATE '1982-07-11', TRUE),
    ('Sofia', 'Castillo', 26, 'sofia.castillo@test.com', DATE '2000-01-29', FALSE),
    ('Ricardo', 'Vega', 38, 'ricardo.vega@test.com', DATE '1988-11-05', TRUE),
    ('Gabriela', 'Torres', 29, 'gabriela.torres@test.com', DATE '1997-06-22', FALSE);

INSERT INTO gs_persona_direccion
(
    id_persona,
    pais,
    ciudad,
    telefono
)
VALUES
    (1, 'Colombia', 'Bogota', '3001002000'),
    (2, 'Mexico', 'Ciudad de Mexico', '3001002001'),
    (3, 'Peru', 'Lima', '3001002002'),
    (4, 'Chile', 'Santiago', '3001002003'),
    (5, 'Argentina', 'Buenos Aires', '3001002004');

INSERT INTO gs_hijo
(
    id_persona,
    nombre,
    apellido,
    fecha_nacimiento
)
VALUES
    (1, 'Valentina', 'Mendoza', DATE '2015-03-08'),
    (1, 'Mateo', 'Mendoza', DATE '2018-09-14'),
    (2, 'Emilia', 'Navarro', DATE '2012-12-01'),
    (4, 'Lucas', 'Vega', DATE '2016-05-20'),
    (4, 'Lucia', 'Vega', DATE '2019-10-03'),
    (5, 'Daniela', 'Torres', DATE '2020-01-17');

INSERT INTO gs_hijo_direccion
(
    id_hijo,
    pais,
    ciudad,
    telefono
)
VALUES
    (1, 'Colombia', 'Bogota', '3002003001'),
    (2, 'Colombia', 'Medellin', '3002003002'),
    (3, 'Mexico', 'Guadalajara', '3002003003'),
    (4, 'Chile', 'Valparaiso', '3002003004'),
    (5, 'Chile', 'Santiago', '3002003005'),
    (6, 'Argentina', 'Cordoba', '3002003006');

CREATE OR REPLACE PROCEDURE gs_sp_get_persona
(
    IN p_id_persona INTEGER,
    OUT p_persona gs_persona_obj
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        p.id_persona,
        p.nombre,
        p.apellido,
        p.edad,
        p.email,
        p.fecha_nacimiento,
        p.activo,
        p.fecha_registro
    INTO p_persona
    FROM gs_persona p
    WHERE p.id_persona = p_id_persona;

    IF NOT FOUND THEN
        p_persona := NULL;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_get_personas
(
    OUT p_personas gs_persona_obj[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        COALESCE(
            ARRAY_AGG(
                ROW(
                    p.id_persona,
                    p.nombre,
                    p.apellido,
                    p.edad,
                    p.email,
                    p.fecha_nacimiento,
                    p.activo,
                    p.fecha_registro
                )::gs_persona_obj
                ORDER BY p.id_persona
            ),
            ARRAY[]::gs_persona_obj[]
        )
    INTO p_personas
    FROM gs_persona p;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_insert_persona
(
    IN p_persona gs_persona_obj,
    OUT p_id_persona INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO gs_persona
    (
        nombre,
        apellido,
        edad,
        email,
        fecha_nacimiento,
        activo
    )
    VALUES
    (
        (p_persona).nombre,
        (p_persona).apellido,
        (p_persona).edad,
        (p_persona).email,
        (p_persona).fecha_nacimiento,
        COALESCE((p_persona).activo, TRUE)
    )
    RETURNING id_persona INTO p_id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_insert_personas
(
    IN p_personas gs_persona_obj[],
    OUT p_insertados INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_persona gs_persona_obj;
BEGIN
    p_insertados := 0;

    IF p_personas IS NULL THEN
        RETURN;
    END IF;

    FOREACH v_persona IN ARRAY p_personas LOOP
        INSERT INTO gs_persona
        (
            nombre,
            apellido,
            edad,
            email,
            fecha_nacimiento,
            activo
        )
        VALUES
        (
            (v_persona).nombre,
            (v_persona).apellido,
            (v_persona).edad,
            (v_persona).email,
            (v_persona).fecha_nacimiento,
            COALESCE((v_persona).activo, TRUE)
        );

        p_insertados := p_insertados + 1;
    END LOOP;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_update_persona
(
    IN p_persona gs_persona_obj,
    OUT p_actualizado BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_row_count INTEGER;
BEGIN
    UPDATE gs_persona
       SET nombre = (p_persona).nombre,
           apellido = (p_persona).apellido,
           edad = (p_persona).edad,
           email = (p_persona).email,
           fecha_nacimiento = (p_persona).fecha_nacimiento,
           activo = COALESCE((p_persona).activo, TRUE)
     WHERE id_persona = (p_persona).id_persona;

    GET DIAGNOSTICS v_row_count = ROW_COUNT;
    p_actualizado := v_row_count > 0;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_delete_persona
(
    IN p_id_persona INTEGER,
    OUT p_eliminado BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_row_count INTEGER;
BEGIN
    DELETE FROM gs_persona
    WHERE id_persona = p_id_persona;

    GET DIAGNOSTICS v_row_count = ROW_COUNT;
    p_eliminado := v_row_count > 0;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_get_persona_detalle
(
    IN p_id_persona INTEGER,
    OUT p_persona gs_persona_detalle_obj
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        p.id_persona,
        p.nombre,
        p.apellido,
        p.edad,
        p.email,
        p.fecha_nacimiento,
        p.activo,
        p.fecha_registro,
        CASE
            WHEN pd.id_direccion IS NULL THEN NULL
            ELSE ROW(pd.pais, pd.ciudad, pd.telefono)::gs_direccion_obj
        END,
        COALESCE(
            (
                SELECT
                    ARRAY_AGG(
                        ROW(
                            h.nombre,
                            h.apellido,
                            h.fecha_nacimiento,
                            CASE
                                WHEN hd.id_direccion IS NULL THEN NULL
                                ELSE ROW(hd.pais, hd.ciudad, hd.telefono)::gs_direccion_obj
                            END
                        )::gs_hijo_obj
                        ORDER BY h.id_hijo
                    )
                FROM gs_hijo h
                LEFT JOIN gs_hijo_direccion hd ON hd.id_hijo = h.id_hijo
                WHERE h.id_persona = p.id_persona
            ),
            ARRAY[]::gs_hijo_obj[]
        )
    INTO p_persona
    FROM gs_persona p
    LEFT JOIN gs_persona_direccion pd ON pd.id_persona = p.id_persona
    WHERE p.id_persona = p_id_persona;

    IF NOT FOUND THEN
        p_persona := NULL;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_get_personas_detalle
(
    OUT p_personas gs_persona_detalle_obj[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        COALESCE(
            ARRAY_AGG(
                ROW(
                    p.id_persona,
                    p.nombre,
                    p.apellido,
                    p.edad,
                    p.email,
                    p.fecha_nacimiento,
                    p.activo,
                    p.fecha_registro,
                    CASE
                        WHEN pd.id_direccion IS NULL THEN NULL
                        ELSE ROW(pd.pais, pd.ciudad, pd.telefono)::gs_direccion_obj
                    END,
                    COALESCE(
                        (
                            SELECT
                                ARRAY_AGG(
                                    ROW(
                                        h.nombre,
                                        h.apellido,
                                        h.fecha_nacimiento,
                                        CASE
                                            WHEN hd.id_direccion IS NULL THEN NULL
                                            ELSE ROW(hd.pais, hd.ciudad, hd.telefono)::gs_direccion_obj
                                        END
                                    )::gs_hijo_obj
                                    ORDER BY h.id_hijo
                                )
                            FROM gs_hijo h
                            LEFT JOIN gs_hijo_direccion hd ON hd.id_hijo = h.id_hijo
                            WHERE h.id_persona = p.id_persona
                        ),
                        ARRAY[]::gs_hijo_obj[]
                    )
                )::gs_persona_detalle_obj
                ORDER BY p.id_persona
            ),
            ARRAY[]::gs_persona_detalle_obj[]
        )
    INTO p_personas
    FROM gs_persona p
    LEFT JOIN gs_persona_direccion pd ON pd.id_persona = p.id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_get_personas_cursor_out
(
    IN p_activo BOOLEAN,
    OUT p_cursor REFCURSOR
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_cursor FOR
    SELECT
        p.id_persona,
        p.nombre,
        p.apellido,
        p.edad,
        p.email,
        p.fecha_nacimiento,
        p.activo,
        p.fecha_registro
    FROM gs_persona p
    WHERE p_activo IS NULL OR p.activo = p_activo
    ORDER BY p.id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_get_personas_cursor_inout
(
    IN p_activo BOOLEAN,
    INOUT p_cursor REFCURSOR
)
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    -- 1. Solo consumir/insertar si realmente llegó un cursor
    IF p_cursor IS NOT NULL THEN
        LOOP
            FETCH p_cursor INTO rec;
            EXIT WHEN NOT FOUND;

            INSERT INTO gs_persona (
                id_persona, nombre, apellido, edad, email,
                fecha_nacimiento, activo, fecha_registro
            )
            VALUES (
                rec.id_persona, rec.nombre, rec.apellido, rec.edad, rec.email,
                rec.fecha_nacimiento, rec.activo, rec.fecha_registro
            )
            ON CONFLICT (id_persona) DO UPDATE SET
                nombre           = EXCLUDED.nombre,
                apellido         = EXCLUDED.apellido,
                edad             = EXCLUDED.edad,
                email            = EXCLUDED.email,
                fecha_nacimiento = EXCLUDED.fecha_nacimiento,
                activo           = EXCLUDED.activo,
                fecha_registro   = EXCLUDED.fecha_registro;
        END LOOP;

        -- 2. Cerrar el cursor de entrada, ya lo consumimos por completo
        CLOSE p_cursor;
    END IF;

    -- 3. Siempre se devuelve el resultado, haya llegado cursor o no
    OPEN p_cursor FOR
    SELECT
        p.id_persona, p.nombre, p.apellido, p.edad,
        p.email, p.fecha_nacimiento, p.activo, p.fecha_registro
    FROM gs_persona p
    WHERE p_activo IS NULL OR p.activo = p_activo
    ORDER BY p.id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_insertar_personas_cursor
(
    IN p_cursor REFCURSOR,
    OUT p_total_procesados INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    rec RECORD;
BEGIN
    p_total_procesados := 0;

    IF p_cursor IS NOT NULL THEN
        LOOP
            FETCH p_cursor INTO rec;
            EXIT WHEN NOT FOUND;

            INSERT INTO gs_persona (
                id_persona, nombre, apellido, edad, email,
                fecha_nacimiento, activo, fecha_registro
            )
            VALUES (
                rec.id_persona, rec.nombre, rec.apellido, rec.edad, rec.email,
                rec.fecha_nacimiento, rec.activo, rec.fecha_registro
            )
            ON CONFLICT (id_persona) DO UPDATE SET
                nombre           = EXCLUDED.nombre,
                apellido         = EXCLUDED.apellido,
                edad             = EXCLUDED.edad,
                email            = EXCLUDED.email,
                fecha_nacimiento = EXCLUDED.fecha_nacimiento,
                activo           = EXCLUDED.activo,
                fecha_registro   = EXCLUDED.fecha_registro;

            p_total_procesados := p_total_procesados + 1;
        END LOOP;

        CLOSE p_cursor;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE public.gs_sp_get_personas_estado_cursor
(
    OUT p_cursor_activos REFCURSOR,
    OUT p_cursor_inactivos REFCURSOR
)
LANGUAGE plpgsql
AS $$
BEGIN
    p_cursor_activos := 'gs_cursor_personas_activas';
    p_cursor_inactivos := 'gs_cursor_personas_inactivas';

    OPEN p_cursor_activos FOR
    SELECT
        p.id_persona,
        p.nombre,
        p.apellido,
        p.edad,
        p.email,
        p.fecha_nacimiento,
        p.activo,
        p.fecha_registro
    FROM gs_persona p
    WHERE p.activo = TRUE
    ORDER BY p.id_persona;

    OPEN p_cursor_inactivos FOR
    SELECT
        p.id_persona,
        p.nombre,
        p.apellido,
        p.edad,
        p.email,
        p.fecha_nacimiento,
        p.activo,
        p.fecha_registro
    FROM gs_persona p
    WHERE p.activo = FALSE
    ORDER BY p.id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_get_persona_json
(
    IN p_id_persona INTEGER,
    OUT p_persona JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        json_build_object(
            'idPersona', p.id_persona,
            'nombre', p.nombre,
            'apellido', p.apellido,
            'edad', p.edad,
            'email', p.email,
            'fechaNacimiento', p.fecha_nacimiento,
            'activo', p.activo,
            'fechaRegistro', p.fecha_registro
        )
    INTO p_persona
    FROM gs_persona p
    WHERE p.id_persona = p_id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_insert_persona_json
(
    IN p_persona JSON,
    OUT p_id_persona INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO gs_persona
    (
        nombre,
        apellido,
        edad,
        email,
        fecha_nacimiento,
        activo
    )
    VALUES
    (
        p_persona ->> 'nombre',
        p_persona ->> 'apellido',
        NULLIF(p_persona ->> 'edad', '')::INTEGER,
        p_persona ->> 'email',
        NULLIF(p_persona ->> 'fechaNacimiento', '')::DATE,
        COALESCE(NULLIF(p_persona ->> 'activo', '')::BOOLEAN, TRUE)
    )
    RETURNING id_persona INTO p_id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_update_persona_json
(
    IN p_persona JSON,
    OUT p_actualizado BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_row_count INTEGER;
BEGIN
    UPDATE gs_persona
       SET nombre = p_persona ->> 'nombre',
           apellido = p_persona ->> 'apellido',
           edad = NULLIF(p_persona ->> 'edad', '')::INTEGER,
           email = p_persona ->> 'email',
           fecha_nacimiento = NULLIF(p_persona ->> 'fechaNacimiento', '')::DATE,
           activo = COALESCE(NULLIF(p_persona ->> 'activo', '')::BOOLEAN, TRUE)
     WHERE id_persona = NULLIF(p_persona ->> 'idPersona', '')::INTEGER;

    GET DIAGNOSTICS v_row_count = ROW_COUNT;
    p_actualizado := v_row_count > 0;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_save_persona_json_inout
(
    INOUT p_persona JSON
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_persona INTEGER;
    v_row_count INTEGER;
    v_accion VARCHAR(20);
BEGIN
    v_id_persona := NULLIF(p_persona ->> 'idPersona', '')::INTEGER;

    IF v_id_persona IS NULL THEN
        INSERT INTO gs_persona
        (
            nombre,
            apellido,
            edad,
            email,
            fecha_nacimiento,
            activo
        )
        VALUES
        (
            p_persona ->> 'nombre',
            p_persona ->> 'apellido',
            NULLIF(p_persona ->> 'edad', '')::INTEGER,
            p_persona ->> 'email',
            NULLIF(p_persona ->> 'fechaNacimiento', '')::DATE,
            COALESCE(NULLIF(p_persona ->> 'activo', '')::BOOLEAN, TRUE)
        )
        RETURNING id_persona INTO v_id_persona;

        v_accion := 'INSERT';
    ELSE
        UPDATE gs_persona
           SET nombre = p_persona ->> 'nombre',
               apellido = p_persona ->> 'apellido',
               edad = NULLIF(p_persona ->> 'edad', '')::INTEGER,
               email = p_persona ->> 'email',
               fecha_nacimiento = NULLIF(p_persona ->> 'fechaNacimiento', '')::DATE,
               activo = COALESCE(NULLIF(p_persona ->> 'activo', '')::BOOLEAN, TRUE)
         WHERE id_persona = v_id_persona;

        GET DIAGNOSTICS v_row_count = ROW_COUNT;

        IF v_row_count = 0 THEN
            p_persona := json_build_object(
                'idPersona', v_id_persona,
                'actualizado', FALSE,
                'accion', 'NO_ENCONTRADO'
            );
            RETURN;
        END IF;

        v_accion := 'UPDATE';
    END IF;

    SELECT
        json_build_object(
            'idPersona', p.id_persona,
            'nombre', p.nombre,
            'apellido', p.apellido,
            'edad', p.edad,
            'email', p.email,
            'fechaNacimiento', p.fecha_nacimiento,
            'activo', p.activo,
            'fechaRegistro', p.fecha_registro,
            'accion', v_accion
        )
    INTO p_persona
    FROM gs_persona p
    WHERE p.id_persona = v_id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_get_persona_jsonb
(
    IN p_id_persona INTEGER,
    OUT p_persona JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        jsonb_build_object(
            'idPersona', p.id_persona,
            'nombre', p.nombre,
            'apellido', p.apellido,
            'edad', p.edad,
            'email', p.email,
            'fechaNacimiento', p.fecha_nacimiento,
            'activo', p.activo,
            'fechaRegistro', p.fecha_registro
        )
    INTO p_persona
    FROM gs_persona p
    WHERE p.id_persona = p_id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_insert_persona_jsonb
(
    IN p_persona JSONB,
    OUT p_id_persona INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO gs_persona
    (
        nombre,
        apellido,
        edad,
        email,
        fecha_nacimiento,
        activo
    )
    VALUES
    (
        p_persona ->> 'nombre',
        p_persona ->> 'apellido',
        NULLIF(p_persona ->> 'edad', '')::INTEGER,
        p_persona ->> 'email',
        NULLIF(p_persona ->> 'fechaNacimiento', '')::DATE,
        COALESCE(NULLIF(p_persona ->> 'activo', '')::BOOLEAN, TRUE)
    )
    RETURNING id_persona INTO p_id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_update_persona_jsonb
(
    IN p_persona JSONB,
    OUT p_actualizado BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_row_count INTEGER;
BEGIN
    UPDATE gs_persona
       SET nombre = p_persona ->> 'nombre',
           apellido = p_persona ->> 'apellido',
           edad = NULLIF(p_persona ->> 'edad', '')::INTEGER,
           email = p_persona ->> 'email',
           fecha_nacimiento = NULLIF(p_persona ->> 'fechaNacimiento', '')::DATE,
           activo = COALESCE(NULLIF(p_persona ->> 'activo', '')::BOOLEAN, TRUE)
     WHERE id_persona = NULLIF(p_persona ->> 'idPersona', '')::INTEGER;

    GET DIAGNOSTICS v_row_count = ROW_COUNT;
    p_actualizado := v_row_count > 0;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_save_persona_jsonb_inout
(
    INOUT p_persona JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_persona INTEGER;
    v_row_count INTEGER;
    v_accion VARCHAR(20);
BEGIN
    v_id_persona := NULLIF(p_persona ->> 'idPersona', '')::INTEGER;

    IF v_id_persona IS NULL THEN
        INSERT INTO gs_persona
        (
            nombre,
            apellido,
            edad,
            email,
            fecha_nacimiento,
            activo
        )
        VALUES
        (
            p_persona ->> 'nombre',
            p_persona ->> 'apellido',
            NULLIF(p_persona ->> 'edad', '')::INTEGER,
            p_persona ->> 'email',
            NULLIF(p_persona ->> 'fechaNacimiento', '')::DATE,
            COALESCE(NULLIF(p_persona ->> 'activo', '')::BOOLEAN, TRUE)
        )
        RETURNING id_persona INTO v_id_persona;

        v_accion := 'INSERT';
    ELSE
        UPDATE gs_persona
           SET nombre = p_persona ->> 'nombre',
               apellido = p_persona ->> 'apellido',
               edad = NULLIF(p_persona ->> 'edad', '')::INTEGER,
               email = p_persona ->> 'email',
               fecha_nacimiento = NULLIF(p_persona ->> 'fechaNacimiento', '')::DATE,
               activo = COALESCE(NULLIF(p_persona ->> 'activo', '')::BOOLEAN, TRUE)
         WHERE id_persona = v_id_persona;

        GET DIAGNOSTICS v_row_count = ROW_COUNT;

        IF v_row_count = 0 THEN
            p_persona := jsonb_build_object(
                'idPersona', v_id_persona,
                'actualizado', FALSE,
                'accion', 'NO_ENCONTRADO'
            );
            RETURN;
        END IF;

        v_accion := 'UPDATE';
    END IF;

    SELECT
        jsonb_build_object(
            'idPersona', p.id_persona,
            'nombre', p.nombre,
            'apellido', p.apellido,
            'edad', p.edad,
            'email', p.email,
            'fechaNacimiento', p.fecha_nacimiento,
            'activo', p.activo,
            'fechaRegistro', p.fecha_registro,
            'accion', v_accion
        )
    INTO p_persona
    FROM gs_persona p
    WHERE p.id_persona = v_id_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_resumen_personas
(
    OUT p_total INTEGER,
    OUT p_activos INTEGER,
    OUT p_inactivos INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        COUNT(*)::INTEGER,
        COUNT(*) FILTER (WHERE activo)::INTEGER,
        COUNT(*) FILTER (WHERE NOT activo)::INTEGER
    INTO p_total, p_activos, p_inactivos
    FROM gs_persona;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_resumen_personas_out
(
    OUT p_total INTEGER,
    OUT p_activos INTEGER,
    OUT p_inactivos INTEGER,
    OUT p_tiene_inactivos BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        COUNT(*)::INTEGER,
        COUNT(*) FILTER (WHERE activo)::INTEGER,
        COUNT(*) FILTER (WHERE NOT activo)::INTEGER,
        EXISTS (
            SELECT 1
            FROM gs_persona
            WHERE activo = FALSE
        )
    INTO
        p_total,
        p_activos,
        p_inactivos,
        p_tiene_inactivos
    FROM gs_persona;
END;
$$;
CREATE OR REPLACE FUNCTION gs_fn_get_personas_table
(
    p_activo BOOLEAN
)
RETURNS TABLE
(
    id_persona INTEGER,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    edad INTEGER,
    email VARCHAR(150),
    fecha_nacimiento DATE,
    activo BOOLEAN,
    fecha_registro TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id_persona,
        p.nombre,
        p.apellido,
        p.edad,
        p.email,
        p.fecha_nacimiento,
        p.activo,
        p.fecha_registro
    FROM gs_persona p
    WHERE p_activo IS NULL OR p.activo = p_activo
    ORDER BY p.id_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_get_personas_setof
(
    p_activo BOOLEAN
)
RETURNS SETOF gs_persona
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.*
    FROM gs_persona p
    WHERE p_activo IS NULL OR p.activo = p_activo
    ORDER BY p.id_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_get_persona_row
(
    p_id_persona INTEGER
)
RETURNS gs_persona
LANGUAGE plpgsql
AS $$
DECLARE
    v_persona gs_persona;
BEGIN
    SELECT p.*
    INTO v_persona
    FROM gs_persona p
    WHERE p.id_persona = p_id_persona;

    RETURN v_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_get_persona_obj
(
    p_id_persona INTEGER
)
RETURNS gs_persona_obj
LANGUAGE plpgsql
AS $$
DECLARE
    v_persona gs_persona_obj;
BEGIN
    SELECT
        p.id_persona,
        p.nombre,
        p.apellido,
        p.edad,
        p.email,
        p.fecha_nacimiento,
        p.activo,
        p.fecha_registro
    INTO v_persona
    FROM gs_persona p
    WHERE p.id_persona = p_id_persona;

    RETURN v_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_get_personas_nombres_setof
(
    p_activo BOOLEAN
)
RETURNS SETOF VARCHAR
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.nombre
    FROM gs_persona p
    WHERE p_activo IS NULL OR p.activo = p_activo
    ORDER BY p.id_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_get_personas_json_setof()
RETURNS SETOF JSON
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT json_build_object(
        'idPersona', p.id_persona,
        'nombre', p.nombre,
        'apellido', p.apellido,
        'fechaNacimiento', p.fecha_nacimiento
    )
    FROM gs_persona p
    ORDER BY p.id_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_get_personas_jsonb_setof()
RETURNS SETOF JSONB
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT jsonb_build_object(
        'idPersona', p.id_persona,
        'nombre', p.nombre,
        'apellido', p.apellido,
        'fechaNacimiento', p.fecha_nacimiento
    )
    FROM gs_persona p
    ORDER BY p.id_persona;
END;
$$;
CREATE TYPE gs_persona_json_obj AS
(
    id_persona INTEGER,
    nombre VARCHAR(100),
    datos JSONB
);
CREATE OR REPLACE FUNCTION gs_fn_get_persona_json_obj
(
    p_id_persona INTEGER
)
RETURNS gs_persona_json_obj
LANGUAGE plpgsql
AS $$
DECLARE
    v_persona gs_persona_json_obj;
BEGIN
    SELECT
        p.id_persona,
        p.nombre,
        jsonb_build_object(
            'email', p.email,
            'activo', p.activo,
            'fechaNacimiento', p.fecha_nacimiento
        )
    INTO v_persona
    FROM gs_persona p
    WHERE p.id_persona = p_id_persona;

    RETURN v_persona;
END;
$$;
CREATE OR REPLACE FUNCTION gs_fn_save_persona_json_obj
(
    p_persona gs_persona_json_obj
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_persona INTEGER;
    v_row_count INTEGER;
    v_datos JSONB;
BEGIN
    IF p_persona IS NULL THEN
        RETURN FALSE;
    END IF;

   v_id_persona := NULLIF((p_persona).id_persona, 0);
    v_datos := COALESCE((p_persona).datos, '{}'::jsonb);

    IF NULLIF((p_persona).nombre, '') IS NULL THEN
        RETURN FALSE;
    END IF;

    IF v_id_persona IS NULL THEN
        IF NULLIF(v_datos ->> 'apellido', '') IS NULL THEN
            RETURN FALSE;
        END IF;

        INSERT INTO gs_persona
        (
            nombre,
            apellido,
            edad,
            email,
            fecha_nacimiento,
            activo
        )
        VALUES
        (
            (p_persona).nombre,
            v_datos ->> 'apellido',
            NULLIF(v_datos ->> 'edad', '')::INTEGER,
            NULLIF(v_datos ->> 'email', ''),
            NULLIF(v_datos ->> 'fechaNacimiento', '')::DATE,
            COALESCE(NULLIF(v_datos ->> 'activo', '')::BOOLEAN, TRUE)
        );

        RETURN TRUE;
    END IF;

    UPDATE gs_persona
       SET nombre = COALESCE(NULLIF((p_persona).nombre, ''), nombre),
           apellido = COALESCE(NULLIF(v_datos ->> 'apellido', ''), apellido),
           edad = CASE
                    WHEN v_datos ? 'edad'
                    THEN NULLIF(v_datos ->> 'edad', '')::INTEGER
                    ELSE edad
                  END,
           email = CASE
                    WHEN v_datos ? 'email'
                    THEN NULLIF(v_datos ->> 'email', '')
                    ELSE email
                  END,
           fecha_nacimiento = CASE
                    WHEN v_datos ? 'fechaNacimiento'
                    THEN NULLIF(v_datos ->> 'fechaNacimiento', '')::DATE
                    ELSE fecha_nacimiento
                  END,
           activo = CASE
                    WHEN v_datos ? 'activo'
                    THEN COALESCE(NULLIF(v_datos ->> 'activo', '')::BOOLEAN, activo)
                    ELSE activo
                  END
     WHERE id_persona = v_id_persona;

    GET DIAGNOSTICS v_row_count = ROW_COUNT;
    RETURN v_row_count > 0;
END;
$$;

CREATE OR REPLACE PROCEDURE gs_sp_incrementar_edad
(
    INOUT p_edad INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    p_edad := COALESCE(p_edad, 0) + 1;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_resumen_personas
(
    OUT total INTEGER,
    OUT activos INTEGER,
    OUT inactivos INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        COUNT(*)::INTEGER,
        COUNT(*) FILTER (WHERE activo)::INTEGER,
        COUNT(*) FILTER (WHERE NOT activo)::INTEGER
    INTO total, activos, inactivos
    FROM gs_persona;
END;
$$;


CREATE OR REPLACE FUNCTION gs_fn_get_personas_por_estado
(
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS SETOF gs_persona
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM gs_persona
    WHERE activo = p_activo
    ORDER BY id_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_buscar_persona(p_id_persona INTEGER)
RETURNS gs_persona AS $$
BEGIN
    RETURN (
        SELECT p
        FROM gs_persona p
        WHERE p.id_persona = p_id_persona
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION gs_fn_get_personas_por_ids
(
    p_ids INTEGER[]
)
RETURNS SETOF gs_persona
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM gs_persona
    WHERE id_persona = ANY(p_ids)
    ORDER BY id_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_get_persona_nullable
(
    p_id_persona INTEGER
)
RETURNS TABLE
(
    id_persona INTEGER,
    edad INTEGER,
    email VARCHAR,
    fecha_nacimiento DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT p.id_persona, NULL::INTEGER, NULL::VARCHAR, NULL::DATE
    FROM gs_persona p
    WHERE p.id_persona = p_id_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_touch_persona_void
(
    p_id_persona INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE gs_persona
       SET fecha_registro = CURRENT_TIMESTAMP
     WHERE id_persona = p_id_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_insert_persona_then_error
(
    p_nombre VARCHAR,
    p_apellido VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO gs_persona
    (
        nombre,
        apellido,
        edad,
        email,
        fecha_nacimiento,
        activo
    )
    VALUES
    (
        p_nombre,
        p_apellido,
        99,
        'rollback.test@test.com',
        DATE '1999-09-09',
        TRUE
    );

    RAISE EXCEPTION 'Error controlado despues de insertar persona';
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_error_controlado()
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Error controlado de prueba';
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_incrementar_edad_inout
(
    INOUT p_edad INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    p_edad := COALESCE(p_edad, 0) + 1;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_resumen_inout
(
    INOUT p_total INTEGER,
    INOUT p_activos INTEGER,
    INOUT p_inactivos INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        COUNT(*)::INTEGER,
        COUNT(*) FILTER (WHERE activo)::INTEGER,
        COUNT(*) FILTER (WHERE NOT activo)::INTEGER
    INTO p_total, p_activos, p_inactivos
    FROM gs_persona;
END;
$$;

CREATE OR REPLACE FUNCTION gs_fn_resumen_mixto
(
    INOUT p_total INTEGER,
    OUT p_activos INTEGER,
    OUT p_inactivos INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        COALESCE(p_total, 0) + COUNT(*)::INTEGER,
        COUNT(*) FILTER (WHERE activo)::INTEGER,
        COUNT(*) FILTER (WHERE NOT activo)::INTEGER
    INTO
        p_total,
        p_activos,
        p_inactivos
    FROM gs_persona;
END;
$$;

-- =========================================================
-- QUERIES GENERATE SERVICE POSTGRESQL
-- =========================================================
-- Copiar la linea SQL en el generador. Los parametros usan sintaxis :name.

-- GS_Q_PERSONA_BY_ID
-- SELECT id_persona, nombre, apellido, edad, email, fecha_nacimiento, activo, fecha_registro FROM gs_persona WHERE id_persona = :id_persona;

-- GS_Q_PERSONAS_BY_NOMBRE
-- SELECT id_persona, nombre, apellido, edad, email, fecha_nacimiento, activo, fecha_registro FROM gs_persona WHERE nombre ILIKE CONCAT('%', CAST(:nombre AS VARCHAR), '%') ORDER BY id_persona;

-- GS_Q_PERSONAS_BY_ACTIVO
-- SELECT id_persona AS persona_id, nombre, apellido, edad, email, activo FROM gs_persona WHERE activo = :activo ORDER BY id_persona;

-- GS_Q_PERSONAS_SELF_JOIN_ACTIVO
-- SELECT p.id_persona AS persona_id, p.nombre, p.apellido, r.id_persona AS referencia_id, r.activo AS activo_referencia FROM gs_persona p INNER JOIN gs_persona r ON r.activo = p.activo WHERE r.id_persona = :id_persona_referencia ORDER BY p.id_persona;

-- GS_Q_PERSONAS_ACTIVAS_WITH
-- WITH personas_filtradas AS (SELECT id_persona, nombre, apellido, activo FROM gs_persona WHERE activo = :activo) SELECT id_persona, nombre, apellido, activo FROM personas_filtradas ORDER BY id_persona;

-- GS_Q_PERSONAS_TOTAL_HIJOS_WITH
-- WITH hijos_por_persona AS (SELECT id_persona, COUNT(1)::INTEGER AS total_hijos FROM gs_hijo GROUP BY id_persona) SELECT p.id_persona, p.nombre, p.apellido, p.activo, COALESCE(h.total_hijos, 0)::INTEGER AS total_hijos FROM gs_persona p LEFT JOIN hijos_por_persona h ON h.id_persona = p.id_persona WHERE p.activo = :activo ORDER BY p.id_persona;

-- GS_Q_PERSONAS_STATS_WITH
-- WITH personas_filtradas AS (SELECT id_persona, edad, activo FROM gs_persona WHERE activo = :activo) SELECT COUNT(*)::INTEGER AS total_personas, COALESCE(AVG(edad)::NUMERIC(10,2), 0) AS edad_promedio, COALESCE(MIN(edad), 0)::INTEGER AS edad_minima, COALESCE(MAX(edad), 0)::INTEGER AS edad_maxima FROM personas_filtradas;

-- GS_Q_PERSONAS_BY_CITY_JOIN
-- SELECT p.id_persona, p.nombre, p.apellido, d.pais, d.ciudad, d.telefono FROM gs_persona p INNER JOIN gs_persona_direccion d ON d.id_persona = p.id_persona WHERE d.ciudad = :ciudad ORDER BY p.id_persona;

-- GS_Q_PERSONAS_BY_JSON
-- SELECT p.id_persona, p.nombre, p.apellido, p.edad, p.email, p.fecha_nacimiento, p.activo, p.fecha_registro FROM json_array_elements(CAST(:personas_json AS json)) AS item(persona) INNER JOIN gs_persona p ON p.id_persona = (item.persona ->> 'idPersona')::INTEGER ORDER BY p.id_persona;

-- GS_Q_PERSONAS_BY_JSONB
-- SELECT p.id_persona, p.nombre, p.apellido, p.edad, p.email, p.fecha_nacimiento, p.activo, p.fecha_registro FROM jsonb_array_elements(CAST(:personas_jsonb AS jsonb)) AS item(persona) INNER JOIN gs_persona p ON p.id_persona = (item.persona ->> 'idPersona')::INTEGER ORDER BY p.id_persona;

-- GS_Q_PERSONAS_AS_JSON
-- SELECT COALESCE(json_agg(json_build_object('idPersona', id_persona, 'nombre', nombre, 'apellido', apellido, 'edad', edad, 'email', email, 'fechaNacimiento', fecha_nacimiento, 'activo', activo, 'fechaRegistro', fecha_registro) ORDER BY id_persona), '[]'::json) AS personas_json FROM gs_persona WHERE activo = :activo;

-- GS_Q_PERSONAS_AS_JSONB
-- SELECT COALESCE(jsonb_agg(jsonb_build_object('idPersona', id_persona, 'nombre', nombre, 'apellido', apellido, 'edad', edad, 'email', email, 'fechaNacimiento', fecha_nacimiento, 'activo', activo, 'fechaRegistro', fecha_registro) ORDER BY id_persona), '[]'::jsonb) AS personas_jsonb FROM gs_persona WHERE activo = :activo;

-- GS_Q_INSERT_PERSONA
-- INSERT INTO gs_persona (nombre, apellido, edad, email, fecha_nacimiento, activo) VALUES (:nombre, :apellido, :edad, :email, :fecha_nacimiento, :activo);

-- GS_Q_INSERT_PERSONA_SELECT
-- INSERT INTO gs_persona (nombre, apellido, edad, email, fecha_nacimiento, activo) SELECT :nombre, p.apellido, p.edad, :email, p.fecha_nacimiento, :activo FROM gs_persona p WHERE p.id_persona = :id_persona_base;

-- GS_Q_UPDATE_PERSONA
-- UPDATE gs_persona SET nombre = :nombre, apellido = :apellido, edad = :edad, email = :email, fecha_nacimiento = :fecha_nacimiento, activo = :activo WHERE id_persona = :id_persona;

-- GS_Q_DELETE_PERSONA
-- DELETE FROM gs_persona WHERE id_persona = :id_persona;
