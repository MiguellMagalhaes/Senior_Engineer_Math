/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o script para criar o ficheiro 404.html necessário para o GitHub Pages.
 * O ficheiro 404.html é uma cópia do index.html que permite que o GitHub Pages funcione corretamente
 * com Single Page Applications (SPAs), redirecionando todas as rotas para o index.html.
 */

// Importa funções do módulo fs/promises para operações de ficheiros assíncronas
// readFile: lê ficheiros, writeFile: escreve ficheiros
import { readFile, writeFile } from "fs/promises";

// Importa a função join do módulo path para construir caminhos de ficheiros
import { join } from "path";

/**
 * Função assíncrona que cria o ficheiro 404.html a partir do index.html
 * Este ficheiro é necessário para que o GitHub Pages funcione corretamente com SPAs
 */
async function create404() {
  // Define o caminho para a pasta dist/public onde os ficheiros compilados estão
  const distPath = join(import.meta.dirname, "..", "dist", "public");
  
  // Define o caminho completo para o ficheiro index.html
  const indexPath = join(distPath, "index.html");
  
  try {
    // Lê o conteúdo do index.html gerado pelo Vite
    const indexContent = await readFile(indexPath, "utf-8");
    
    // Cria o 404.html como uma cópia exata do index.html
    // Isto é necessário porque o GitHub Pages não suporta nativamente SPAs
    // Quando uma rota não existe, o GitHub Pages serve o 404.html
    // Como o 404.html é idêntico ao index.html, o JavaScript carrega e faz o routing client-side
    await writeFile(join(distPath, "404.html"), indexContent);
    
    // Regista sucesso no console
    console.log("✅ 404.html criado com sucesso!");
  } catch (error: any) {
    // Se houver erro ao criar o 404.html, regista o erro e termina o processo
    console.error("❌ Erro ao criar 404.html:", error.message);
    process.exit(1);
  }
}

// Executa a função create404
create404();

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */