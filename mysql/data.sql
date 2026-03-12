CREATE TABLE client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    cell_phone VARCHAR(20),
    address VARCHAR(200)
);

DELIMITER //
CREATE PROCEDURE get_all_client()
BEGIN
    SELECT id, name, email, cell_phone, address FROM client;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE get_client_by_id(IN p_id INT)
BEGIN
    SELECT id, name, email, cell_phone, address
    FROM client
    WHERE id = p_id;
END //

DELIMITER //
CREATE PROCEDURE insert_client(IN p_client JSON)
BEGIN
    INSERT INTO client (name, email, cell_phone, address)
    SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(p_client, '$.name')),
        JSON_UNQUOTE(JSON_EXTRACT(p_client, '$.email')),
        JSON_UNQUOTE(JSON_EXTRACT(p_client, '$.cellPhone')),
        JSON_UNQUOTE(JSON_EXTRACT(p_client, '$.address'));
END  //


DELIMITER //
CREATE PROCEDURE insert_multiple_client(IN p_clients JSON)
BEGIN
    INSERT INTO client (name, email, cell_phone, address)
    SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.name')),
        JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.email')),
        JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.cellPhone')),
        JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.address'))
    FROM JSON_TABLE(p_clients, '$[*]' COLUMNS (
        value JSON PATH '$'
    )) AS j;
END //


DELIMITER //
CREATE PROCEDURE update_client(IN p_client JSON)
BEGIN
    DECLARE v_id INT;
    DECLARE v_name VARCHAR(100);
    DECLARE v_email VARCHAR(100);
    DECLARE v_cell_phone VARCHAR(20);
    DECLARE v_address VARCHAR(200);

    SET v_id = JSON_UNQUOTE(JSON_EXTRACT(p_client, '$.id'));
    SET v_name = JSON_UNQUOTE(JSON_EXTRACT(p_client, '$.name'));
    SET v_email = JSON_UNQUOTE(JSON_EXTRACT(p_client, '$.email'));
    SET v_cell_phone = JSON_UNQUOTE(JSON_EXTRACT(p_client, '$.cellPhone'));
    SET v_address = JSON_UNQUOTE(JSON_EXTRACT(p_client, '$.address'));

    UPDATE client
    SET name = v_name,
        email = v_email,
        cell_phone = v_cell_phone,
        address = v_address
    WHERE id = v_id;
END //


DELIMITER //
CREATE FUNCTION delete_client(p_id INT)
RETURNS BOOLEAN
BEGIN
    DECLARE result BOOLEAN DEFAULT FALSE;

    DELETE FROM client WHERE id = p_id;

    IF ROW_COUNT() > 0 THEN
        SET result = TRUE;
    END IF;

    RETURN result;
END//
DELIMITER ;
-- SELECT ID, NAME , EMAIL,CELL_PHONE,ADDRESS FROM CLIENT WHERE NAME = :name;