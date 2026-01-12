/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém a configuração da conexão com a base de dados PostgreSQL.
 * Utiliza Drizzle ORM para gestão de queries e schema, e pg (node-postgres) para o pool de conexões.
 */

// Importa a função drizzle do Drizzle ORM para criar a instância do cliente de base de dados
import { drizzle } from "drizzle-orm/node-postgres";

// Importa o módulo pg (node-postgres) para criar o pool de conexões
import pg from "pg";

// Importa todos os schemas da pasta shared para usar nas queries
import * as schema from "@shared/schema";

// Extrai a classe Pool do módulo pg
const { Pool } = pg;

// Valida se a variável de ambiente DATABASE_URL está definida
// Esta variável contém a string de conexão com a base de dados PostgreSQL
if (!process.env.DATABASE_URL) {
  // Se não estiver definida, lança um erro explicativo
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Cria um pool de conexões com a base de dados PostgreSQL
// O pool gerencia múltiplas conexões de forma eficiente
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Cria a instância do Drizzle ORM com o pool e os schemas
// O Drizzle permite fazer queries type-safe usando os schemas definidos
export const db = drizzle(pool, { schema });

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
