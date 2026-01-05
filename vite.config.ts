/**
 * Trabalho realizado por Miguel Magalhães, aluno de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém a configuração do Vite.
 * O Vite é a ferramenta de build e desenvolvimento usada neste projeto.
 * Define plugins, aliases de caminhos, configurações de build e servidor.
 */

// Importa a função defineConfig do Vite para criar a configuração
import { defineConfig } from "vite";

// Importa o plugin do React para o Vite
// Permite que o Vite processe ficheiros JSX/TSX
import react from "@vitejs/plugin-react";

// Importa o módulo path do Node.js para trabalhar com caminhos de ficheiros
import path from "path";

// Importa o plugin de overlay de erros do Replit
// Mostra erros de runtime em um modal (apenas em desenvolvimento)
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

/**
 * Exporta a configuração do Vite
 * Esta configuração é usada tanto em desenvolvimento quanto em produção
 */
export default defineConfig({
  // Array de plugins do Vite
  plugins: [
    // Plugin do React (obrigatório para projetos React)
    react(),
    
    // Plugin de overlay de erros (mostra erros em modal)
    runtimeErrorOverlay(),
    
    // Plugins condicionais do Replit (apenas em desenvolvimento e se REPL_ID estiver definido)
    // Estes plugins são específicos do ambiente Replit e não afetam o build normal
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          // Plugin cartographer (mapeamento de código) - carregado dinamicamente
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          // Plugin de banner de desenvolvimento - carregado dinamicamente
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []), // Se não for desenvolvimento ou não estiver no Replit, não carrega estes plugins
  ],
  
  // Configuração de resolução de módulos (aliases de caminhos)
  resolve: {
    alias: {
      // Alias "@" aponta para a pasta client/src
      // Permite usar importações como "@/components/..." em vez de "../../components/..."
      "@": path.resolve(import.meta.dirname, "client", "src"),
      
      // Alias "@shared" aponta para a pasta shared
      // Permite importar esquemas e rotas compartilhados
      "@shared": path.resolve(import.meta.dirname, "shared"),
      
      // Alias "@assets" aponta para a pasta attached_assets
      // Permite importar assets anexados
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  
  // Define a pasta raiz do projeto Vite
  // Todas as importações relativas começam a partir desta pasta
  root: path.resolve(import.meta.dirname, "client"),
  
  // Define o caminho base da aplicação
  // Em desenvolvimento: "/" (raiz)
  // Em produção (GitHub Pages): "/Senior_Engineer_Math/" (nome do repositório)
  // Isto é crucial para que os assets sejam carregados corretamente no GitHub Pages
  base: process.env.GITHUB_PAGES_BASE || "/",
  
  // Configurações de build (produção)
  build: {
    // Pasta de saída dos ficheiros compilados
    // Os ficheiros serão gerados em dist/public
    outDir: path.resolve(import.meta.dirname, "dist", "public"),
    
    // Limpa a pasta de saída antes de cada build
    // Garante que não ficam ficheiros antigos
    emptyOutDir: true,
  },
  
  // Configurações do servidor de desenvolvimento
  server: {
    fs: {
      // Modo estrito de sistema de ficheiros
      // Previne acesso a ficheiros fora do projeto
      strict: true,
      
      // Lista de padrões de ficheiros a negar acesso
      // "**/.*" nega acesso a todos os ficheiros ocultos (que começam com ponto)
      deny: ["**/.*"],
    },
  },
});

/**
 * Trabalho realizado por Miguel Magalhães, aluno de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
