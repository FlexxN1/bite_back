USE bqfyebofyngwdhsd4xuy;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen_url VARCHAR(255), -- Aquí se guarda la URL de la imagen
    stock INT DEFAULT 0,
    vendedor_id INT NOT NULL, -- el administrador que subió el producto
    cliente_id INT,           -- opcional: el cliente que lo compró
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendedor_id) REFERENCES administradores(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
);

-- ================================
-- Datos de prueba
-- ================================

-- Clientes
INSERT INTO clientes (nombre, email, password)
VALUES
('Juan Pérez', 'juan@example.com', '12345'),
('Ana Torres', 'ana@example.com', 'clave123');

-- Administradores
INSERT INTO administradores (nombre, email, password)
VALUES
('Admin1', 'admin1@example.com', 'adminpass'),
('Admin2', 'admin2@example.com', 'pass456');

-- Productos (de clientes)
INSERT INTO productos (nombre, descripcion, precio, stock, vendedor_id, imagen_url)
VALUES
('Aguacate Hass', 'Aguacate fresco de exportación', 5000, 100, 1, 'https://example.com/imagenes/aguacate_hass.jpg'),
('Aguacate Criollo', 'Pequeño pero muy sabroso', 3500, 50, 2, 'https://example.com/imagenes/aguacate_criollo.jpg');


