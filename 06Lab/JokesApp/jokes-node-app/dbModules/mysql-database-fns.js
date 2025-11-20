const mysql = require('mysql2/promise');

let pool;

function initDBPool() {
    pool = mysql.createPool({
        host: process.env.HOST_NAME || 'localhost',
        user: process.env.USER_NAME || 'root',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'jokesapp',
        port: 3306,

        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

async function isConnected() {
    try {
        const [result] = await queryDatabase('SELECT DATABASE() AS CurrentDatabase');
        return result.CurrentDatabase === (process.env.DB_NAME || 'jokesapp');
    } catch (err) {
        await pool.end();
        throw err;
    }
}

async function queryDatabase(query, params = []) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.execute(query, params);
        return results;
    } catch (err) {
        return err;
    } finally {
        if (connection) connection.release();
    }
}

async function getData(table, conditions = []) {
    let sql = `SELECT * FROM ${table}`;
    if (conditions.length > 0 && conditions[0] !== 'any') {
        sql += ` WHERE type = ?`;
    }
    try {
        return await queryDatabase(sql, conditions);
    } catch (err) {
        return err;
    }
}

initDBPool();

module.exports = {
    isConnected,
    getData,
}