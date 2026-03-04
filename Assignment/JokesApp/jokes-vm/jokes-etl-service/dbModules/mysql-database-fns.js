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

/**
 * Saves a joke or type to the MySQL database.
 * @param {string} table - The name of the table (e.g., 'jokes').
 * @param {object} data - The joke object containing type, setup, and punchline.
 */
async function saveData(table, data) {
    const sql = `INSERT INTO ${table} (type, setup, punchline) VALUES (?, ?, ?)`;
    const params = [data.type, data.setup, data.punchline];

    try {
        const result = await queryDatabase(sql, params);
        if (result.affectedRows > 0) {
            console.log(`Successfully saved to MySQL table: ${table}`);
            return result;
        }
        throw new Error('Failed to insert record');
    } catch (err) {
        console.error('MySQL Save Error:', err.message);
        throw err;
    }
}

initDBPool();

module.exports = {
    isConnected,
    getData,
    saveData
}