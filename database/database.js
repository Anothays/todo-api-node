import fs from "fs";
import path from "path";
import initSqlJs from "sql.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: move to env vars later
const NODE_ENV = process.env.NODE_ENV || "development";
const dbName = NODE_ENV === "test" ? "todo.test.db" : "todo.db";
const DB_PATH = path.join(__dirname, "..", dbName);

let db;

/**
 * Returns the SQLite (sql.js) database instance, creating and loading it from disk
 * if needed. Creates the `todos` table if it does not exist.
 * @returns {Promise<import("sql.js").Database>} The database instance
 */
async function getDb() {
  if (db) return db;
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

/**
 * Persists the in-memory database to disk (.db file).
 * Does nothing if the database has not been initialized via getDb().
 * @returns {void}
 */
function saveDb() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

/**
 * Resets the in-memory db and removes the db file. For test isolation only.
 * @returns {void}
 */
function resetForTesting() {
  db = null;
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
}

export { getDb, saveDb, resetForTesting };
