const express = require("express");
const pool = require("./db");

const app = express();

app.get("/", (req, res) => {
    res.send("welcome to server");
});

app.get("/ping", async (req, res) => {
    try {
        const [result] = await pool.query(`SELECT "hello world" as RESULT`);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en /ping" });
    }
});

app.get("/create", async (req, res) => {
    try {
        const [result] = await pool.query(`INSERT INTO users (name) VALUES ("John")`);
        res.json({ id: result.insertId, message: "Usuario creado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en /create" });
    }
});

// 🚀 Aquí agregas tu endpoint de clientes
app.get("/clientes", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM clientes");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener clientes" });
    }
});

// Railway usa process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server on port ${PORT}`);
});
