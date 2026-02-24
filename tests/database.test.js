import { jest } from "@jest/globals";

const fsMock = {
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
};

await jest.unstable_mockModule("fs", () => ({ default: fsMock }));
await jest.unstable_mockModule("sql.js", () => ({
  default: jest.fn(() =>
    Promise.resolve({
      Database: jest.fn().mockImplementation(function () {
        this.run = jest.fn();
        this.export = jest.fn().mockReturnValue(new Uint8Array(0));
        return this;
      }),
    })
  ),
}));

describe("Database module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveDb", () => {
    it("does nothing when db has not been initialized", async () => {
      await jest.isolateModulesAsync(async () => {
        const { saveDb } = await import("../database/database.js");
        saveDb();
        expect(fsMock.writeFileSync).not.toHaveBeenCalled();
      });
    });
  });

  describe("getDb", () => {
    it("initializes db and creates table when file does not exist", async () => {
      fsMock.existsSync.mockReturnValue(false);

      const { getDb } = await import("../database/database.js");
      const db = await getDb();

      expect(db).toBeDefined();
      expect(db.run).toHaveBeenCalledWith(
        expect.stringContaining("CREATE TABLE IF NOT EXISTS todos")
      );
      expect(fsMock.readFileSync).not.toHaveBeenCalled();
    });

    it("initializes db from file when file exists", async () => {
      const fakeBuffer = Buffer.from("fake-db-content");
      fsMock.existsSync.mockReturnValue(true);
      fsMock.readFileSync.mockReturnValue(fakeBuffer);

      let getDbRef;
      await jest.isolateModulesAsync(async () => {
        const mod = await import("../database/database.js");
        getDbRef = mod.getDb;
      });
      const db = await getDbRef();

      expect(db).toBeDefined();
      expect(fsMock.readFileSync).toHaveBeenCalled();
      expect(db.run).toHaveBeenCalledWith(
        expect.stringContaining("CREATE TABLE IF NOT EXISTS todos")
      );
    });

    it("returns the same db instance on subsequent calls", async () => {
      fsMock.existsSync.mockReturnValue(false);

      const { getDb } = await import("../database/database.js");
      const db1 = await getDb();
      const db2 = await getDb();

      expect(db1).toBe(db2);
    });
  });

  describe("saveDb", () => {
    it("writes to file when db has been initialized", async () => {
      fsMock.existsSync.mockReturnValue(false);

      const { getDb, saveDb } = await import("../database/database.js");
      await getDb();
      saveDb();

      expect(fsMock.writeFileSync).toHaveBeenCalled();
    });
  });
});
