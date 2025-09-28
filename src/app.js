// src/app.js
const express = require('express');
const cors = require('cors');

const app = express();

// middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Ruta básica para probar que la API responde
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: '🚀 API viva y respondiendo sin DB',
        env: process.env.NODE_ENV || 'dev',
        port: process.env.PORT || 3000,
    });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ API running on port ${PORT}`);
});
