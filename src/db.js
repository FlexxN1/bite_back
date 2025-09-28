const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    user: "root",
    password: "jaja1193430070",
    host: "127.0.0.1",
    port: 3306,
    database: "bite_back"
});

module.exports = pool;
