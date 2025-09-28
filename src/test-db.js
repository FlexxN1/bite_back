app.get("/testdb", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT NOW() as now");
        res.json(rows);
    } catch (err) {
        console.error("❌ Error conectando a la DB:", err);
        res.status(500).json({ error: "No se pudo conectar a la DB" });
    }
});
