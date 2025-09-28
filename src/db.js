import {createPool} from "mysql2/promise"

export const pool = createPool({
    user: "root",
    password: "jaja1193430070",
    host: "localhost",
    port : 3306,
    database: "bite_back1"
})