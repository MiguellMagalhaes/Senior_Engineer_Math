/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o script para verificar se a tabela 'session' existe na base de dados.
 * A tabela 'session' é necessária para armazenar sessões de utilizadores quando o backend está ativo.
 */

// Importa a configuração do dotenv para carregar variáveis de ambiente
import "dotenv/config";

// Importa o pool de conexões da base de dados
import { pool } from "../server/db";

/**
 * Função assíncrona que verifica se a tabela 'session' existe na base de dados
 * Consulta o information_schema do PostgreSQL para verificar a existência da tabela
 */
async function checkSessionTable() {
  try {
    // Executa uma query SQL para verificar se a tabela 'session' existe
    // A query consulta o information_schema.tables que contém metadados de todas as tabelas
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'session'
      );
    `);
    
    // Verifica o resultado da query
    // result.rows[0].exists será true se a tabela existir, false caso contrário
    if (result.rows[0].exists) {
      // Se a tabela existe, regista sucesso no console
      console.log("✅ Tabela 'session' existe");
    } else {
      // Se a tabela não existe, regista aviso e instruções
      console.log("❌ Tabela 'session' NÃO existe");
      console.log("Execute: npm run db:session");
    }
  } catch (error: any) {
    // Se houver erro durante a verificação, regista o erro no console
    console.error("Erro:", error.message);
  } finally {
    // Sempre fecha a conexão com a base de dados, mesmo se houver erro
    await pool.end();
  }
}

// Executa a função checkSessionTable
checkSessionTable();

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */