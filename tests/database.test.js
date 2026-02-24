const fs = require("fs");
const path = require("path");

jest.mock("fs");
jest.mock("sql.js", () => {
  const mockInit = jest.fn(() =>
    Promise.resolve({
      Database: jest.fn().mockImplementation(function () {
        this.run = jest.fn();
        this.export = jest.fn().mockReturnValue(new Uint8Array(0));
        return this;
      }),
    })
  );
  return mockInit;
});

describe("Database module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveDb", () => {
    it("does nothing when db has not been initialized", () => {
      jest.isolateModules(() => {
        const { saveDb } = require("../database/database");
        saveDb();
        expect(fs.writeFileSync).not.toHaveBeenCalled();
      });
    });
  });

  describe("getDb", () => {
    it("initializes db and creates table when file does not exist", async () => {
      fs.existsSync.mockReturnValue(false);

      const { getDb } = require("../database/database");
      const db = await getDb();

      expect(db).toBeDefined();
      expect(db.run).toHaveBeenCalledWith(
        expect.stringContaining("CREATE TABLE IF NOT EXISTS todos")
      );
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    it("initializes db from file when file exists", async () => {
      const fakeBuffer = Buffer.from("fake-db-content");
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(fakeBuffer);

      let getDbRef;
      jest.isolateModules(() => {
        getDbRef = require("../database/database").getDb;
      });
      const db = await getDbRef();

      expect(db).toBeDefined();
      expect(fs.readFileSync).toHaveBeenCalled();
      expect(db.run).toHaveBeenCalledWith(
        expect.stringContaining("CREATE TABLE IF NOT EXISTS todos")
      );
    });

    it("returns the same db instance on subsequent calls", async () => {
      fs.existsSync.mockReturnValue(false);

      const { getDb } = require("../database/database");
      const db1 = await getDb();
      const db2 = await getDb();

      expect(db1).toBe(db2);
    });
  });

  describe("saveDb", () => {
    it("writes to file when db has been initialized", async () => {
      fs.existsSync.mockReturnValue(false);

      const { getDb, saveDb } = require("../database/database");
      await getDb();
      saveDb();

      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });
});
