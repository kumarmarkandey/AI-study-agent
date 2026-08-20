const mysql = require("mysql2");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "studysphere",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// TiDB Cloud & Remote Cloud MySQL require SSL/TLS enabled
if (process.env.DB_HOST && process.env.DB_HOST !== "localhost") {
  dbConfig.ssl = {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  };
}

const db = mysql.createPool(dbConfig);

module.exports = db;