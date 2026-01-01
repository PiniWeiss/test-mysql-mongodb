import mysql from "mysql2/promise";

async function connectToMysql() {
  try {
    return mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      port: 3306,
    });
  } catch (error) {
    console.log(error.message);
    return {};
  }
}
export const getMysqlConn = await connectToMysql();

export async function initSqlDb() {
  try {
    await getMysqlConn.query("CREATE DATABASE IF NOT EXISTS messages_db");
    await getMysqlConn.query("USE messages_db");
    await getMysqlConn.query(`
      CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  cipher_type VARCHAR(50),
  encrypted_text VARCHAR(255) NOT NULL,
  inserted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
    `);
  } catch (err) {
    console.log(err.message);
  }
}
