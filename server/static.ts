/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém a função para servir ficheiros estáticos em produção.
 * Serve os ficheiros compilados do frontend React e redireciona todas as rotas para index.html
 * para suportar Single Page Applications (SPAs).
 */

// Importa o tipo Express do Express.js
import express, { type Express } from "express";

// Importa o módulo fs para verificar se ficheiros existem
import fs from "fs";

// Importa o módulo path para trabalhar com caminhos de ficheiros
import path from "path";

/**
 * Função que configura o servidor Express para servir ficheiros estáticos
 * Em produção, serve os ficheiros compilados do frontend
 * 
 * @param app - Instância do Express
 */
export function serveStatic(app: Express) {
  // Define o caminho para a pasta dist/public onde estão os ficheiros compilados
  const distPath = path.resolve(__dirname, "public");
  
  // Verifica se a pasta dist existe
  // Se não existir, lança um erro explicativo
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Configura o Express para servir ficheiros estáticos da pasta dist/public
  // Isto permite servir CSS, JS, imagens, etc. diretamente
  app.use(express.static(distPath));

  // Middleware catch-all que redireciona todas as rotas para index.html
  // Isto é necessário para SPAs funcionarem corretamente
  // Quando o utilizador acede a uma rota diretamente (ex: /about), o servidor
  // serve o index.html, e o React Router faz o routing client-side
  app.use("*", (_req, res) => {
    // Envia o ficheiro index.html para qualquer rota não encontrada
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
