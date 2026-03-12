CREATE TABLE client (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100),
    email NVARCHAR(100),
    cell_phone NVARCHAR(20),
    address NVARCHAR(200)
);

CREATE TYPE client_tab AS TABLE (
    name NVARCHAR(100),
    email NVARCHAR(100),
    cell_phone NVARCHAR(20),
    address NVARCHAR(200)
);

CREATE FUNCTION get_all_client()
RETURNS TABLE
AS
RETURN (
    SELECT id, name, email, cell_phone, address
    FROM client
);

CREATE PROCEDURE get_client_by_id
    @p_id INT
AS
BEGIN
    SELECT id, name, email, cell_phone, address
    FROM client
    WHERE id = @p_id;
END;

CREATE PROCEDURE insert_client
    @name NVARCHAR(100),
    @email NVARCHAR(100),
    @cell_phone NVARCHAR(20),
    @address NVARCHAR(200)
AS
BEGIN
    INSERT INTO client (name, email, cell_phone, address)
    VALUES (@name, @email, @cell_phone, @address);
END;

CREATE PROCEDURE insert_multiple_client
    @p_clients client_tab READONLY
AS
BEGIN
    INSERT INTO client (name, email, cell_phone, address)
    SELECT name, email, cell_phone, address
    FROM @p_clients;
END;

CREATE PROCEDURE update_client
    @id INT,
    @name NVARCHAR(100),
    @email NVARCHAR(100),
    @cell_phone NVARCHAR(20),
    @address NVARCHAR(200)
AS
BEGIN
    UPDATE client
    SET name = @name,
        email = @email,
        cell_phone = @cell_phone,
        address = @address
    WHERE id = @id;

    IF @@ROWCOUNT = 0
        THROW 50001, 'No existe cliente con el ID especificado', 1;
END;

CREATE PROCEDURE delete_client
    @p_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM client WHERE id = @p_id;

    IF @@ROWCOUNT > 0
        PRINT 'Cliente eliminado';
    ELSE
        PRINT 'Cliente no encontrado';
END;

-- get_client_by_name
-- SELECT ID, NAME , EMAIL,CELL_PHONE,ADDRESS FROM CLIENT WHERE NAME = :name;