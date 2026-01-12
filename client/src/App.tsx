/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro é o componente principal da aplicação React.
 * Define a estrutura de roteamento e os providers globais da aplicação.
 * Utiliza Wouter para roteamento e TanStack React Query para gestão de estado.
 */

// Importa os componentes de roteamento do Wouter
// Switch permite alternar entre rotas, Route define uma rota, Router configura o roteador
import { Switch, Route, Router } from "wouter";

// Importa o provider do TanStack React Query para gestão de estado e cache
import { QueryClientProvider } from "@tanstack/react-query";

// Importa o cliente de query configurado (instância do React Query)
import { queryClient } from "./lib/queryClient";

// Importa o componente Toaster para exibir notificações toast
import { Toaster } from "@/components/ui/toaster";

// Importa o TooltipProvider para habilitar tooltips em toda a aplicação
import { TooltipProvider } from "@/components/ui/tooltip";

// Importa o componente de página não encontrada (404)
import NotFound from "@/pages/not-found";

// Importa o componente da página principal (Home)
import Home from "@/pages/Home";

// Obtém o caminho base do Vite (definido durante o build)
// Em desenvolvimento é "/" e em produção é "/Senior_Engineer_Math/"
// Isto é necessário para o GitHub Pages funcionar corretamente
const base = import.meta.env.BASE_URL || "/";

// Debug: regista o caminho base no console durante o desenvolvimento
// Isto ajuda a verificar se o base path está configurado corretamente
if (import.meta.env.DEV) {
  console.log("Base URL:", base);
  console.log("Current pathname:", window.location.pathname);
}

/**
 * Componente de roteamento da aplicação
 * Configura o router do Wouter com o caminho base correto
 * Define as rotas disponíveis na aplicação
 */
function AppRouter() {
  return (
    // Router do Wouter com o caminho base configurado
    // O base path permite que a aplicação funcione em subdiretórios (como GitHub Pages)
    <Router base={base}>
      {/* Switch permite alternar entre diferentes rotas */}
      <Switch>
        {/* Rota para a página principal (Home) quando o caminho é "/" */}
        <Route path="/" component={Home} />
        {/* Rota padrão (catch-all) que mostra a página 404 para qualquer outro caminho */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

/**
 * Componente principal da aplicação (App)
 * Envolve toda a aplicação com os providers necessários
 * Fornece contexto global para queries, tooltips e notificações
 */
function App() {
  return (
    // QueryClientProvider fornece o cliente React Query para toda a aplicação
    // Permite usar hooks como useQuery e useMutation em qualquer componente
    <QueryClientProvider client={queryClient}>
      {/* TooltipProvider habilita tooltips em toda a aplicação */}
      <TooltipProvider>
        {/* Toaster renderiza as notificações toast na interface */}
        <Toaster />
        {/* AppRouter renderiza o sistema de roteamento */}
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Exporta o componente App como exportação padrão
export default App;

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
