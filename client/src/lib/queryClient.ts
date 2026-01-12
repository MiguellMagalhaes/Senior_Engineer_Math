/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro configura o cliente React Query (TanStack Query).
 * Define configurações globais para queries e mutations.
 * Inclui funções auxiliares para fazer requisições à API (não usadas neste projeto simplificado).
 */

// Importa tipos e classes do TanStack React Query
// QueryClient: cliente principal para gerir queries e cache
// QueryFunction: tipo para funções de query
import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Função auxiliar que lança uma exceção se a resposta HTTP não for bem-sucedida
 * 
 * @param res - Objeto Response do fetch
 * @throws Error se a resposta não for ok (status < 200 ou >= 300)
 */
async function throwIfResNotOk(res: Response) {
  // Verifica se a resposta não é bem-sucedida
  if (!res.ok) {
    // Tenta obter o texto da resposta ou usa o statusText
    const text = (await res.text()) || res.statusText;
    // Lança uma exceção com o status e mensagem
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Função auxiliar para fazer requisições à API
 * Não é usada neste projeto simplificado (sem backend)
 * Mantida para compatibilidade futura
 * 
 * @param method - Método HTTP (GET, POST, PUT, DELETE, etc.)
 * @param url - URL do endpoint
 * @param data - Dados a enviar no corpo (opcional)
 * @returns Promise com a Response
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Faz a requisição fetch
  const res = await fetch(url, {
    method,                                    // Método HTTP
    headers: data ? { "Content-Type": "application/json" } : {}, // Headers (só se houver dados)
    body: data ? JSON.stringify(data) : undefined,              // Corpo da requisição (JSON)
    credentials: "include",                   // Inclui cookies na requisição
  });

  // Verifica se a resposta é válida
  await throwIfResNotOk(res);
  
  // Retorna a resposta
  return res;
}

/**
 * Tipo que define o comportamento quando há erro 401 (não autorizado)
 * "returnNull": retorna null em vez de lançar erro
 * "throw": lança uma exceção
 */
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Função factory que cria uma função de query para React Query
 * Não é usada neste projeto simplificado (sem backend)
 * Mantida para compatibilidade futura
 * 
 * @param options - Opções de configuração
 * @param options.on401 - Comportamento quando há erro 401
 * @returns Função de query que pode ser usada pelo React Query
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Faz fetch usando a queryKey como URL
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include", // Inclui cookies
    });

    // Se o comportamento for "returnNull" e o status for 401, retorna null
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    // Verifica se a resposta é válida
    await throwIfResNotOk(res);
    
    // Retorna o JSON da resposta
    return await res.json();
  };

/**
 * Cliente React Query configurado globalmente
 * Define opções padrão para todas as queries e mutations
 * 
 * Configurações:
 * - queries: opções para queries (GET requests)
 * - mutations: opções para mutations (POST, PUT, DELETE requests)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Função padrão de query (comportamento para erro 401: lançar exceção)
      queryFn: getQueryFn({ on401: "throw" }),
      // Não refaz queries automaticamente em intervalos
      refetchInterval: false,
      // Não refaz queries quando a janela ganha foco
      refetchOnWindowFocus: false,
      // Dados nunca ficam stale (sempre considerados frescos)
      staleTime: Infinity,
      // Não tenta novamente em caso de erro
      retry: false,
    },
    mutations: {
      // Não tenta novamente mutations em caso de erro
      retry: false,
    },
  },
});

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
