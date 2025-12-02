-- Crear esquema (si no existe)
CREATE DATABASE IF NOT EXISTS orderflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE orderflow;

-- Tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  telefono VARCHAR(50) NULL,
  direccion VARCHAR(250) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  creado_por VARCHAR(100) NULL,
  actualizado_por VARCHAR(100) NULL,
  PRIMARY KEY (id),
  INDEX idx_clientes_nombre (nombre),
  INDEX idx_clientes_activo (activo)
);

-- Crear cliente
DELIMITER //
CREATE PROCEDURE sp_clientes_crear (
  IN p_nombre VARCHAR(150),
  IN p_email VARCHAR(180),
  IN p_telefono VARCHAR(50),
  IN p_direccion VARCHAR(250),
  IN p_creado_por VARCHAR(100)
)
BEGIN
  INSERT INTO clientes (nombre, email, telefono, direccion, activo, creado_por)
  VALUES (p_nombre, p_email, p_telefono, p_direccion, 1, p_creado_por);

  SELECT LAST_INSERT_ID() AS id;
END//
DELIMITER ;

-- Actualizar cliente
DELIMITER //
CREATE PROCEDURE sp_clientes_actualizar (
  IN p_id BIGINT,
  IN p_nombre VARCHAR(150),
  IN p_telefono VARCHAR(50),
  IN p_direccion VARCHAR(250),
  IN p_actualizado_por VARCHAR(100)
)
BEGIN
  UPDATE clientes
     SET nombre = COALESCE(p_nombre, nombre),
         telefono = COALESCE(p_telefono, telefono),
         direccion = COALESCE(p_direccion, direccion),
         actualizado_por = p_actualizado_por
   WHERE id = p_id AND activo = 1;
  SELECT ROW_COUNT() AS afectados;
END//
DELIMITER ;

-- Borrado lógico
DELIMITER //
CREATE PROCEDURE sp_clientes_borrar (
  IN p_id BIGINT,
  IN p_actualizado_por VARCHAR(100)
)
BEGIN
  UPDATE clientes
     SET activo = 0,
         actualizado_por = p_actualizado_por
   WHERE id = p_id AND activo = 1;
  SELECT ROW_COUNT() AS afectados;
END//
DELIMITER ;

-- Listar clientes (sin paginación, DataGrid maneja internamente)
DELIMITER //
CREATE PROCEDURE sp_clientes_listar ()
BEGIN
  SELECT id, nombre, email, telefono, direccion, activo, creado_en, actualizado_en
    FROM clientes
   WHERE activo = 1
   ORDER BY creado_en DESC;
END//
DELIMITER ;
