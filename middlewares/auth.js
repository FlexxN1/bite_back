const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (allowedRoles = []) {
    return (req, res, next) => {
        try {
            const header = req.headers.authorization;
            if (!header) return res.status(401).json({ error: 'Token no provisto' });
            const token = header.split(' ')[1];
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload; // { id, role, nombre, table }
            if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
                if (!allowedRoles.includes(payload.role)) return res.status(403).json({ error: 'Acceso denegado' });
            }
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
    };
};
