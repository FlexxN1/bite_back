const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    user: "u9qmbwqvt9ojhey5",
    password: "FpWYqD99X605YXS46VnS",
    host: "bhc2g6pxbayk4bkibxfe-mysql.services.clever-cloud.com",
    port: 3306,
    database: "bhc2g6pxbayk4bkibxfe"
});

module.exports = pool;
