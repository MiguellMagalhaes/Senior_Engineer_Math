/**
 * Trabalho realizado por Miguel Magalhães, aluno de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o script de build para produção.
 * Compila o frontend React usando Vite e cria o ficheiro 404.html
 * necessário para o GitHub Pages funcionar corretamente com SPAs (Single Page Applications).
 */

// Importa a função build do Vite para compilar o projeto
import { build as viteBuild } from "vite";

// Importa funções do módulo fs/promises para operações de ficheiros assíncronas
// rm: remove ficheiros/pastas, readFile: lê ficheiros, writeFile: escreve ficheiros
import { rm, readFile, writeFile } from "fs/promises";

// Importa a função join do módulo path para construir caminhos de ficheiros
import { join } from "path";

/**
 * Função assíncrona principal que executa todo o processo de build
 * 1. Remove a pasta dist anterior
 * 2. Compila o projeto com Vite
 * 3. Cria o ficheiro 404.html para GitHub Pages
 */
async function buildAll() {
  // Remove a pasta dist completamente (se existir)
  // recursive: true = remove recursivamente (inclui subpastas)
  // force: true = não lança erro se a pasta não existir
  await rm("dist", { recursive: true, force: true });

  // Regista mensagem no console
  console.log("Building client for GitHub Pages...");
  
  // Executa o build do Vite
  // Isto compila todo o código React, TypeScript, CSS, etc.
  // Os ficheiros são gerados em dist/public
  await viteBuild();
  
  // Cria o ficheiro 404.html para GitHub Pages SPA routing
  // O GitHub Pages usa 404.html para lidar com rotas client-side
  // Isto garante que todas as rotas são tratadas pela SPA
  const distPath = join(import.meta.dirname, "..", "dist", "public");
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
    console.log("✅ 404.html criado para GitHub Pages SPA routing");
  } catch (error: any) {
    // Se houver erro ao criar o 404.html, apenas regista um aviso
    // Não interrompe o build, pois o 404.html não é crítico (apenas melhora a experiência)
    console.warn("⚠️  Aviso: Não foi possível criar 404.html:", error.message);
  }
  
  // Regista conclusão do build
  console.log("✅ Build complete! Files are in dist/public");
  console.log("📦 Ready for GitHub Pages deployment");
}

// Executa a função buildAll
// Se houver erro, regista no console e termina o processo com código de erro
buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Trabalho realizado por Miguel Magalhães, aluno de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
