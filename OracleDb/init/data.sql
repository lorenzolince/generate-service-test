CREATE TABLE client (
    id           NUMBER PRIMARY KEY,
    name         VARCHAR2(100),
    email        VARCHAR2(100),
    cell_phone   VARCHAR2(20),
    address      VARCHAR2(200)
);
/
-- Tipo objeto que representa un cliente
CREATE OR REPLACE TYPE client_obj AS OBJECT (
    id          NUMBER,
    name        VARCHAR2(100),
    email       VARCHAR2(100),
    cell_phone  VARCHAR2(20),
    address     VARCHAR2(200)
);
/
-- Tipo tabla basado en el objeto cliente
CREATE OR REPLACE TYPE client_tab AS TABLE OF client_obj;
/
CREATE OR REPLACE PACKAGE client_pkg AS
    FUNCTION get_all_client RETURN client_tab PIPELINED;
    PROCEDURE get_client_by_id(p_id NUMBER, p_client OUT client_obj);
END client_pkg;
/
CREATE OR REPLACE PACKAGE BODY client_pkg AS

    FUNCTION get_all_client RETURN client_tab PIPELINED IS
        v_client client_obj;
    BEGIN
        FOR rec IN (SELECT * FROM client) LOOP
            v_client := client_obj(rec.id, rec.name, rec.email, rec.cell_phone, rec.address);
            PIPE ROW(v_client);
        END LOOP;
        RETURN;
    END get_all_client;

    PROCEDURE get_client_by_id(p_id NUMBER, p_client OUT client_obj) IS
    BEGIN
        SELECT client_obj(id, name, email, cell_phone, address)
        INTO p_client
        FROM client
        WHERE id = p_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_client := NULL;
    END get_client_by_id;

END client_pkg;
/
-- Inserta un cliente
CREATE OR REPLACE PROCEDURE insert_client(p_client client_obj) IS
BEGIN
    INSERT INTO client (id, name, email, cell_phone, address)
    VALUES (p_client.id, p_client.name, p_client.email, p_client.cell_phone, p_client.address);
EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20001, 'Error al insertar cliente: ' || SQLERRM);
END insert_client;
/

-- Inserta múltiples clientes
CREATE OR REPLACE PROCEDURE insert_multiple_client(p_clients client_tab) IS
BEGIN
    FOR i IN 1 .. p_clients.COUNT LOOP
        INSERT INTO client (id, name, email, cell_phone, address)
        VALUES (p_clients(i).id, p_clients(i).name, p_clients(i).email, p_clients(i).cell_phone, p_clients(i).address);
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20002, 'Error al insertar múltiples clientes: ' || SQLERRM);
END insert_multiple_client;
/
CREATE OR REPLACE FUNCTION delete_client(p_id NUMBER) RETURN BOOLEAN IS
BEGIN
    DELETE FROM client WHERE id = p_id;
    RETURN SQL%ROWCOUNT > 0;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END delete_cliente;
/
CREATE OR REPLACE PROCEDURE update_client(p_client client_obj) IS
BEGIN
    UPDATE client
    SET name       = p_client.name,
        email      = p_client.email,
        cell_phone = p_client.cell_phone,
        address    = p_client.address
    WHERE id = p_client.id;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'No existe cliente con el ID especificado');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20004, 'Error al actualizar cliente: ' || SQLERRM);
END update_client;
/

-- get_client_by_name
-- SELECT ID, NAME , EMAIL,CELL_PHONE,ADDRESS FROM CLIENT WHERE NAME = :name;