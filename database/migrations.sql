USE bhc2g6pxbayk4bkibxfe;

-- ======================================
-- Tabla de usuarios (clientes y admins)
-- ======================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('Cliente', 'Administrador') NOT NULL DEFAULT 'Cliente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- Tabla de productos
-- ======================================
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen_url VARCHAR(255), 
    stock INT DEFAULT 0,
    vendedor_id INT NOT NULL, -- usuario administrador que subió el producto
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ======================================
-- Tabla de compras
-- ======================================
CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL, -- el cliente que compra
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    estado ENUM('pendiente', 'pagado', 'enviado', 'cancelado') DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


-- ======================================
-- Tabla detalle de compras
-- ======================================
CREATE TABLE IF NOT EXISTS detalle_compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compra_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ======================================
-- Datos de prueba
-- ======================================

-- Usuarios
INSERT INTO usuarios (nombre, email, password, tipo_usuario)
VALUES
('Juan Pérez', 'juan@example.com', '12345', 'Cliente'),
('Ana Torres', 'ana@example.com', 'clave123', 'Cliente'),
('Admin1', 'admin1@example.com', 'adminpass', 'Administrador'),
('Admin2', 'admin2@example.com', 'pass456', 'Administrador');

-- Productos
INSERT INTO productos (nombre, descripcion, precio, stock, vendedor_id, imagen_url)
VALUES
('Aguacate Hass', 'Aguacate fresco de exportación', 5000, 100, 3, 'https://example.com/imagenes/aguacate_hass.jpg'),
('Aguacate Criollo', 'Pequeño pero muy sabroso', 3500, 50, 4, 'https://example.com/imagenes/aguacate_criollo.jpg');

-- Ejemplo de compra
INSERT INTO compras (usuario_id, total, ciudad, direccion, telefono, estado)
VALUES (1, 20000, 'Bogotá', 'Calle 123 #45-67', '3001234567', 'pendiente');


INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario)
VALUES (1, 2, 3, 3500);

