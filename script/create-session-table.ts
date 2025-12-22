import "dotenv/config";
import { pool } from "../server/db";
import { readFile } from "fs/promises";
import { join } from "path";

async function createSessionTable() {
  try {
    const sqlFile = join(process.cwd(), "node_modules/connect-pg-simple/table.sql");
    const sql = await readFile(sqlFile, "utf-8");
    
    await pool.query(sql);
    console.log("✅ Tabela 'session' criada com sucesso!");
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      console.log("ℹ️  Tabela 'session' já existe");
    } else {
      console.error("❌ Erro ao criar tabela:", error.message);
      throw error;
    }
  } finally {
    await pool.end();
  }
}

createSessionTable();

