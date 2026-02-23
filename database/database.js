const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

// TODO: move to env vars later
const NODE_ENV = process.env.NODE_ENV || "development";
const dbName = NODE_ENV === "test" ? "todo.test.db" : "todo.db";
const DB_PATH = path.join(__dirname, "..", dbName);

let db;

async function getDb() {
  if (db) return db;
  console.log("initializing database connection");
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending'
    )
  `);
  return db;
}

function saveDb() {
  if (db) {
    console.log("saving database to disk");
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

module.exports = { getDb, saveDb };
