import { pool } from "../config/db";
import fs from "fs";

const runMigration = async (file: string) => {
  const sql = fs.readFileSync(file, "utf8");
  await pool.query(sql);
  console.log(`Migration ${file} applied`);
};

(async () => {
  try {
    await runMigration("src/migrations/001_create_users.sql");
    await runMigration("src/migrations/002_create_products.sql");
    console.log("All migrations applied successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
})();

// npx tsx src/scripts/runMigrations.ts =Run on terminal to migrate the database
