// routes/products.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../../middlewares/auth');

// Listar todos los productos (publico)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT p.*, a.nombre as vendedor FROM productos p LEFT JOIN administradores a ON p.vendedor_id = a.id ORDER BY p.fecha_creacion DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error servidor' });
    }
});

// Obtener producto por id
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT p.*, a.nombre as vendedor FROM productos p LEFT JOIN administradores a ON p.vendedor_id = a.id WHERE p.id = ?`,
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error servidor' });
    }
});

// Crear producto (solo administradores/vendedores)
router.post('/', auth(['administrador']), async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock = 0, imagen_url } = req.body;
        if (!nombre || !precio) return res.status(400).json({ error: 'Nombre y precio requeridos' });

        // req.user.id viene del token (id en tabla administradores)
        const vendedor_id = req.user.id;
        const [r] = await pool.execute(
            `INSERT INTO productos (nombre, descripcion, precio, imagen_url, stock, vendedor_id) VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, descripcion || null, precio, imagen_url || null, stock, vendedor_id]
        );
        res.json({ id: r.insertId, message: 'Producto creado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error servidor' });
    }
});

// Actualizar producto (solo dueño)
router.put('/:id', auth(['administrador']), async (req, res) => {
    try {
        const productId = req.params.id;
        const vendedorId = req.user.id;

        // comprobar dueño
        const [found] = await pool.execute('SELECT vendedor_id FROM productos WHERE id = ?', [productId]);
        if (!found.length) return res.status(404).json({ error: 'Producto no existe' });
        if (found[0].vendedor_id !== vendedorId) return res.status(403).json({ error: 'No autorizado' });

        const { nombre, descripcion, precio, stock, imagen_url } = req.body;
        await pool.execute(
            `UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen_url = ? WHERE id = ?`,
            [nombre, descripcion, precio, stock, imagen_url, productId]
        );
        res.json({ message: 'Producto actualizado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error servidor' });
    }
});

// Eliminar producto (solo dueño)
router.delete('/:id', auth(['administrador']), async (req, res) => {
    try {
        const productId = req.params.id;
        const vendedorId = req.user.id;

        const [found] = await pool.execute('SELECT vendedor_id FROM productos WHERE id = ?', [productId]);
        if (!found.length) return res.status(404).json({ error: 'Producto no existe' });
        if (found[0].vendedor_id !== vendedorId) return res.status(403).json({ error: 'No autorizado' });

        await pool.execute('DELETE FROM productos WHERE id = ?', [productId]);
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error servidor' });
    }
});

module.exports = router;
