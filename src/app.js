const express = require("express");
const pool = require("./db"); // tu conexión mysql2/promise

const app = express();

// 🔍 Debug para saber qué PORT manda Railway
console.log("ENV PORT:", process.env.PORT);

// Ruta raíz
app.get("/", (req, res) => {
    res.send("welcome to server");
});

// Ruta de prueba simple
app.get("/ping", async (req, res) => {
    try {
        const [result] = await pool.query(`SELECT "hello world" as RESULT`);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en /ping" });
    }
});

// Crear usuario de prueba
app.get("/create", async (req, res) => {
    try {
        const [result] = await pool.query(`INSERT INTO users (name) VALUES ("John")`);
        res.json({ id: result.insertId, message: "Usuario creado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en /create" });
    }
});

// 🚀 Obtener todos los clientes
app.get("/clientes", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM clientes");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener clientes" });
    }
});

// 🔧 Test conexión DB
app.get("/testdb", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT NOW() AS now");
        res.json(rows);
    } catch (err) {
        console.error("❌ Error conectando a la DB:", err);
        res.status(500).json({ error: "No se pudo conectar a la DB" });
    }
});

// 🚀 Importante: usar process.env.PORT (el que da Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server on port ${PORT}`);
});
