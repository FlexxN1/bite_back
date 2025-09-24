const express = require('express');
const router = express.Router();
const pool = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

router.post('/register', async (req, res) => {
    const { nombre, email, password, role = 'cliente' } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ error: 'Faltan datos' });

    try {
        // elegimos tabla según role
        const table = (role === 'administrador' || role === 'vendedor') ? 'administradores' : 'clientes';

        // revisar si email existe
        const [found] = await pool.execute(`SELECT id FROM ${table} WHERE email = ?`, [email]);
        if (found.length) return res.status(409).json({ error: 'Email ya registrado' });

        const hash = await bcrypt.hash(password, 10);
        const [r] = await pool.execute(`INSERT INTO ${table} (nombre, email, password) VALUES (?, ?, ?)`, [nombre, email, hash]);
        const id = r.insertId;

        const token = jwt.sign({ id, role: (table === 'administradores' ? 'administrador' : 'cliente'), nombre, table }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id, nombre, email, role: (table === 'administradores' ? 'administrador' : 'cliente') } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error servidor' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan datos' });

    try {
        // buscar en administradores y clientes
        let user = null;
        let table = null;
        for (const t of ['administradores', 'clientes']) {
            const [rows] = await pool.execute(`SELECT * FROM ${t} WHERE email = ?`, [email]);
            if (rows.length) { user = rows[0]; table = t; break; }
        }
        if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

        const role = (table === 'administradores') ? 'administrador' : 'cliente';
        const token = jwt.sign({ id: user.id, role, nombre: user.nombre, table }, JWT_SECRET, { expiresIn: '8h' });

        res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error servidor' });
    }
});

module.exports = router;
