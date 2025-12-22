import "dotenv/config";
import { pool } from "../server/db";

async function checkSessionTable() {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'session'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log("✅ Tabela 'session' existe");
    } else {
      console.log("❌ Tabela 'session' NÃO existe");
      console.log("Execute: npm run db:session");
    }
  } catch (error: any) {
    console.error("Erro:", error.message);
  } finally {
    await pool.end();
  }
}

checkSessionTable();

