import mysql from "mysql2"

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    // password: '',
    database: 'shopdb'
});

export default pool.promise();