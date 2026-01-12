/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o script para criar a tabela 'session' na base de dados.
 * A tabela 'session' é necessária para armazenar sessões de utilizadores usando connect-pg-simple.
 */

// Importa a configuração do dotenv para carregar variáveis de ambiente
import "dotenv/config";

// Importa o pool de conexões da base de dados
import { pool } from "../server/db";

// Importa a função readFile do módulo fs/promises para ler ficheiros
import { readFile } from "fs/promises";

// Importa a função join do módulo path para construir caminhos de ficheiros
import { join } from "path";

/**
 * Função assíncrona que cria a tabela 'session' na base de dados
 * Lê o ficheiro SQL do pacote connect-pg-simple e executa-o na base de dados
 */
async function createSessionTable() {
  try {
    // Define o caminho para o ficheiro SQL do connect-pg-simple
    // Este ficheiro contém o schema SQL necessário para criar a tabela de sessões
    const sqlFile = join(process.cwd(), "node_modules/connect-pg-simple/table.sql");
    
    // Lê o conteúdo do ficheiro SQL
    const sql = await readFile(sqlFile, "utf-8");
    
    // Executa o SQL na base de dados para criar a tabela
    await pool.query(sql);
    
    // Regista sucesso no console
    console.log("✅ Tabela 'session' criada com sucesso!");
  } catch (error: any) {
    // Se a tabela já existir, apenas regista uma mensagem informativa
    if (error.message.includes("already exists")) {
      console.log("ℹ️  Tabela 'session' já existe");
    } else {
      // Se houver outro tipo de erro, regista o erro e lança a exceção
      console.error("❌ Erro ao criar tabela:", error.message);
      throw error;
    }
  } finally {
    // Sempre fecha a conexão com a base de dados, mesmo se houver erro
    await pool.end();
  }
}

// Executa a função createSessionTable
createSessionTable();

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */