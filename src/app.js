const express = require("express");
const pool = require("./db"); // db.js debe exportar el pool con module.exports

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

app.listen(3000, () => {
    console.log("server on port 3000");
});
