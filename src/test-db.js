const mysql = require("mysql2/promise");
require("dotenv").config();

(async () => {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [rows] = await conn.query("SELECT NOW() as now");
        console.log("✅ Conexión exitosa:", rows);
        await conn.end();
    } catch (err) {
        console.error("❌ Error conectando a la DB:", err.message);
        process.exit(1);
    }
})();