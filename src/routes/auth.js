// src/routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Registro
router.post('/register', async (req, res) => {
    const { nombre, email, password, tipo_usuario = 'Cliente' } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ error: 'Faltan datos' });

    try {
        const [found] = await pool.execute(`SELECT id FROM usuarios WHERE email = ?`, [email]);
        if (found.length) return res.status(409).json({ error: 'Email ya registrado' });

        const hash = await bcrypt.hash(password, 10);
        const [r] = await pool.execute(
            `INSERT INTO usuarios (nombre, email, password, tipo_usuario) VALUES (?, ?, ?, ?)`,
            [nombre, email, hash, tipo_usuario]
        );
        const id = r.insertId;

        const token = jwt.sign({ id, tipo_usuario, nombre }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id, nombre, email, tipo_usuario } });
    } catch (err) {
        console.error("❌ Error en /register:", err);
        res.status(500).json({ error: 'Error servidor' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan datos' });

    try {
        const [rows] = await pool.execute(`SELECT * FROM usuarios WHERE email = ?`, [email]);
        if (!rows.length) return res.status(401).json({ error: 'Credenciales inválidas' });

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

        const token = jwt.sign({ id: user.id, tipo_usuario: user.tipo_usuario, nombre: user.nombre }, JWT_SECRET, { expiresIn: '8h' });

        res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, tipo_usuario: user.tipo_usuario } });
    } catch (err) {
        console.error("❌ Error en /login:", err);
        res.status(500).json({ error: 'Error servidor' });
    }
});

module.exports = router;
