const http = require('http');
const url = require('url');
const querystring = require('querystring');

const port = 3000;

// Función para parsear JSON del body
const parseJSON = (req, callback) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const parsed = body ? JSON.parse(body) : {};
            callback(null, parsed);
        } catch (error) {
            callback(error, null);
        }
    });
};

// Función para enviar respuesta JSON
const sendJSON = (res, statusCode, data) => {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    });
    res.end(JSON.stringify(data));
};

// Base de datos en memoria (simulada)
let users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', age: 25 },
    { id: 2, name: 'María García', email: 'maria@email.com', age: 30 },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com', age: 28 }
];

let nextId = 4;

// Función helper para encontrar usuario por ID
const findUserById = (id) => {
    return users.find(user => user.id === parseInt(id));
};

// Función helper para validar datos de usuario
const validateUser = (user) => {
    const errors = [];
    
    if (!user.name || user.name.trim() === '') {
        errors.push('El nombre es requerido');
    }
    
    if (!user.email || user.email.trim() === '') {
        errors.push('El email es requerido');
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
        errors.push('El email debe tener un formato válido');
    }
    
    if (!user.age || user.age < 0) {
        errors.push('La edad debe ser un número positivo');
    }
    
    return errors;
};

// Crear servidor HTTP
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    
    // Manejar preflight OPTIONS para CORS
    if (method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        });
        res.end();
        return;
    }
    
    // Ruteo principal
    if (path === '/api/users' && method === 'GET') {
        // GET todos los usuarios
        sendJSON(res, 200, {
            success: true,
            data: users,
            message: 'Usuarios obtenidos exitosamente'
        });
        
    } else if (path.match(/^\/api\/users\/\d+$/) && method === 'GET') {
        // GET usuario por ID
        const id = path.split('/')[3];
        const user = findUserById(id);
        
        if (!user) {
            sendJSON(res, 404, {
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }
        
        sendJSON(res, 200, {
            success: true,
            data: user,
            message: 'Usuario obtenido exitosamente'
        });
        
    } else if (path === '/api/users' && method === 'POST') {
        // POST crear usuario
        parseJSON(req, (error, body) => {
            if (error) {
                sendJSON(res, 400, {
                    success: false,
                    message: 'JSON inválido'
                });
                return;
            }
            
            const { name, email, age } = body;
            
            // Validar datos
            const errors = validateUser(body);
            if (errors.length > 0) {
                sendJSON(res, 400, {
                    success: false,
                    message: 'Errores de validación',
                    errors: errors
                });
                return;
            }
            
            // Verificar si el email ya existe
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                sendJSON(res, 400, {
                    success: false,
                    message: 'El email ya está registrado'
                });
                return;
            }
            
            // Crear nuevo usuario
            const newUser = {
                id: nextId++,
                name: name.trim(),
                email: email.trim(),
                age: parseInt(age)
            };
            
            users.push(newUser);
            
            sendJSON(res, 201, {
                success: true,
                data: newUser,
                message: 'Usuario creado exitosamente'
            });
        });
        
    } else if (path.match(/^\/api\/users\/\d+$/) && method === 'PUT') {
        // PUT actualizar usuario completo
        const id = path.split('/')[3];
        const user = findUserById(id);
        
        if (!user) {
            sendJSON(res, 404, {
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }
        
        parseJSON(req, (error, body) => {
            if (error) {
                sendJSON(res, 400, {
                    success: false,
                    message: 'JSON inválido'
                });
                return;
            }
            
            // Validar datos
            const errors = validateUser(body);
            if (errors.length > 0) {
                sendJSON(res, 400, {
                    success: false,
                    message: 'Errores de validación',
                    errors: errors
                });
                return;
            }
            
            // Verificar si el email ya existe (excepto el usuario actual)
            const existingUser = users.find(u => u.email === body.email && u.id !== parseInt(id));
            if (existingUser) {
                sendJSON(res, 400, {
                    success: false,
                    message: 'El email ya está registrado'
                });
                return;
            }
            
            // Actualizar usuario
            user.name = body.name.trim();
            user.email = body.email.trim();
            user.age = parseInt(body.age);
            
            sendJSON(res, 200, {
                success: true,
                data: user,
                message: 'Usuario actualizado exitosamente'
            });
        });
        
    } else if (path.match(/^\/api\/users\/\d+$/) && method === 'PATCH') {
        // PATCH actualizar usuario parcial
        const id = path.split('/')[3];
        const user = findUserById(id);
        
        if (!user) {
            sendJSON(res, 404, {
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }
        
        parseJSON(req, (error, body) => {
            if (error) {
                sendJSON(res, 400, {
                    success: false,
                    message: 'JSON inválido'
                });
                return;
            }
            
            const { name, email, age } = body;
            
            // Validar solo los campos que se están actualizando
            const errors = [];
            
            if (name !== undefined && (!name || name.trim() === '')) {
                errors.push('El nombre no puede estar vacío');
            }
            
            if (email !== undefined) {
                if (!email || email.trim() === '') {
                    errors.push('El email no puede estar vacío');
                } else if (!/\S+@\S+\.\S+/.test(email)) {
                    errors.push('El email debe tener un formato válido');
                } else {
                    // Verificar si el email ya existe
                    const existingUser = users.find(u => u.email === email && u.id !== parseInt(id));
                    if (existingUser) {
                        errors.push('El email ya está registrado');
                    }
                }
            }
            
            if (age !== undefined && (age < 0 || isNaN(age))) {
                errors.push('La edad debe ser un número positivo');
            }
            
            if (errors.length > 0) {
                sendJSON(res, 400, {
                    success: false,
                    message: 'Errores de validación',
                    errors: errors
                });
                return;
            }
            
            // Actualizar solo los campos proporcionados
            if (name !== undefined) user.name = name.trim();
            if (email !== undefined) user.email = email.trim();
            if (age !== undefined) user.age = parseInt(age);
            
            sendJSON(res, 200, {
                success: true,
                data: user,
                message: 'Usuario actualizado exitosamente'
            });
        });
        
    } else if (path.match(/^\/api\/users\/\d+$/) && method === 'DELETE') {
        // DELETE eliminar usuario
        const id = path.split('/')[3];
        const userIndex = users.findIndex(user => user.id === parseInt(id));
        
        if (userIndex === -1) {
            sendJSON(res, 404, {
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }
        
        const deletedUser = users.splice(userIndex, 1)[0];
        
        sendJSON(res, 200, {
            success: true,
            data: deletedUser,
            message: 'Usuario eliminado exitosamente'
        });
        
    } else if (path === '/api/info' && method === 'GET') {
        // GET información de la API
        sendJSON(res, 200, {
            name: 'API de Prueba CRUD',
            version: '1.0.0',
            description: 'API para pruebas con operaciones CRUD en usuarios',
            endpoints: {
                'GET /api/users': 'Obtener todos los usuarios',
                'GET /api/users/:id': 'Obtener usuario por ID',
                'POST /api/users': 'Crear nuevo usuario',
                'PUT /api/users/:id': 'Actualizar usuario completo',
                'PATCH /api/users/:id': 'Actualizar usuario parcial',
                'DELETE /api/users/:id': 'Eliminar usuario'
            },
            example_user: {
                name: 'Nombre del usuario',
                email: 'email@ejemplo.com',
                age: 25
            }
        });
        
    } else {
        // Ruta no encontrada
        sendJSON(res, 404, {
            success: false,
            message: 'Endpoint no encontrado'
        });
    }
});

// Iniciar servidor
server.listen(port, () => {
    console.log(`API de prueba corriendo en http://localhost:${port}`);
    console.log(`Visita http://localhost:${port}/api/info para ver la documentación`);
});

module.exports = server;