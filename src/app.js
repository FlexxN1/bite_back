import express from "express"
import { pool } from "./db.js";

const app = express()

app.get("/", (req, res) => {
    res.send("welcome to server")
})

app.get("/ping", async (req, res) => {
    const [result] = await pool.query(`SELECT "hello wordl as RESULT"`)
    res.json(result[0])

})

app.get("/create", async (req, res) => {
    await pool.query(`INSERT INTO users(name) VALUES ("John)`)
    res.json(result)
})


app.listen(3000)
console.log("server on port 3000")