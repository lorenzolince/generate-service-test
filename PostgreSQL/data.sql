CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    cell_phone VARCHAR(20),
    address VARCHAR(200)
);
-- Tipo compuesto para un cliente
CREATE TYPE client_obj AS (
    id INTEGER,
    name VARCHAR(100),
    email VARCHAR(100),
    cell_phone VARCHAR(20),
    address VARCHAR(200)
);


CREATE OR REPLACE FUNCTION get_all_client()
RETURNS SETOF client_obj AS $$
BEGIN
    RETURN QUERY
    SELECT id, name, email, cell_phone, address
    FROM client;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE get_client_by_id(p_id INTEGER, OUT p_client client_obj)
AS $$
BEGIN
    SELECT id, name, email, cell_phone, address
    INTO p_client
    FROM client
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE insert_client(p_client client_obj)
AS $$
BEGIN
    INSERT INTO client (name, email, cell_phone, address)
    VALUES (p_client.name, p_client.email, p_client.cell_phone, p_client.address);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE insert_multiple_client(p_clients client_obj[])
AS $$
DECLARE
    c client_obj;
BEGIN
    FOREACH c IN ARRAY p_clients LOOP
        INSERT INTO client (name, email, cell_phone, address)
        VALUES (c.name, c.email, c.cell_phone, c.address);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE update_client(p_client client_obj)
AS $$
BEGIN
    UPDATE client
    SET name       = p_client.name,
        email      = p_client.email,
        cell_phone = p_client.cell_phone,
        address    = p_client.address
    WHERE id = p_client.id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe cliente con el ID %', p_client.id;
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION delete_client(p_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM client WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- get_client_by_name
-- SELECT ID, NAME , EMAIL,CELL_PHONE,ADDRESS FROM CLIENT WHERE NAME = :name;

