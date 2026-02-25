import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";
import { getDb, saveDb, resetForTesting } from "../database/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.join(__dirname, "..", "todo.test.db");

describe("Database module", () => {
  beforeEach(() => {
    resetForTesting();
  });

  describe("saveDb", () => {
    it("does nothing when db has not been initialized", () => {
      saveDb();
      expect(fs.existsSync(testDbPath)).toBe(false);
    });
  });

  describe("getDb", () => {
    it("initializes db and creates table when file does not exist", async () => {
      const db = await getDb();
      expect(db).toBeDefined();
      expect(db.run).toBeDefined();
      saveDb();
      expect(fs.existsSync(testDbPath)).toBe(true);
    });

    it("initializes db from file when file exists", async () => {
      const SQL = await initSqlJs();
      const tempDb = new SQL.Database();
      tempDb.run(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'pending'
        )
      `);
      const data = tempDb.export();
      fs.writeFileSync(testDbPath, Buffer.from(data));

      resetForTesting(false);
      const db = await getDb();

      expect(db).toBeDefined();
      expect(db.run).toBeDefined();
    });

    it("returns the same db instance on subsequent calls", async () => {
      const db1 = await getDb();
      const db2 = await getDb();
      expect(db1).toBe(db2);
    });
  });

  describe("saveDb", () => {
    it("writes to file when db has been initialized", async () => {
      await getDb();
      saveDb();
      expect(fs.existsSync(testDbPath)).toBe(true);
    });
  });
});
