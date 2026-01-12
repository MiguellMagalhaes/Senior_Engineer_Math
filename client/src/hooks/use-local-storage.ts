/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o hook useLocalStorage.
 * Implementa a gestão do histórico de cálculos usando o localStorage do navegador.
 * Permite guardar, carregar, limpar e obter estatísticas dos cálculos realizados.
 * O histórico é persistente entre sessões do navegador.
 */

// Importa hooks do React
// useState: para gerir estado local
// useEffect: para executar código quando o componente monta
import { useState, useEffect } from "react";

/**
 * Interface que define a estrutura de um item do histórico
 * Cada cálculo guardado tem estas propriedades
 */
export interface CalculationHistoryItem {
  id: string;                    // Identificador único (timestamp)
  type: "energy" | "network" | "cpu"; // Tipo de cálculo (energia, rede ou CPU)
  functionExpression: string;    // Expressão matemática usada
  t1: number;                    // Tempo inicial
  t2: number;                    // Tempo final
  result: number;                // Valor do integral calculado
  timestamp: string;              // Data e hora do cálculo (ISO string)
}

// Chave usada no localStorage para guardar o histórico
const STORAGE_KEY = "calculation-history";

// Número máximo de cálculos a guardar (mantém apenas os 100 mais recentes)
const MAX_HISTORY = 100;

/**
 * Hook useLocalStorage
 * Fornece funções e estado para gerir o histórico de cálculos
 * 
 * @returns Objeto com:
 *   - history: array com o histórico de cálculos
 *   - saveCalculation: função para guardar um cálculo
 *   - clearHistory: função para limpar o histórico
 *   - getStatistics: função para obter estatísticas
 */
export function useLocalStorage() {
  // Estado que armazena o histórico de cálculos
  // Inicialmente é um array vazio
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);

  /**
   * useEffect que carrega o histórico do localStorage quando o componente monta
   * Executa apenas uma vez (array de dependências vazio)
   */
  useEffect(() => {
    try {
      // Tenta obter o histórico do localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      
      // Se existir histórico guardado, converte de JSON para objeto JavaScript
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      // Se houver erro ao carregar (ex: JSON inválido), regista no console
      console.error("Error loading history from localStorage:", error);
      // Mantém o histórico vazio em caso de erro
    }
  }, []); // Array vazio = executa apenas uma vez quando o componente monta

  /**
   * Função para guardar um cálculo no histórico
   * Adiciona o cálculo ao início do array (mais recente primeiro)
   * Mantém apenas os MAX_HISTORY mais recentes
   * 
   * @param item - Objeto com os dados do cálculo (sem id e timestamp, que são gerados)
   */
  const saveCalculation = (item: Omit<CalculationHistoryItem, "id" | "timestamp">) => {
    // Cria um novo item completo com id e timestamp
    const newItem: CalculationHistoryItem = {
      ...item,                              // Spread dos dados recebidos
      id: Date.now().toString(),           // ID único baseado no timestamp atual
      timestamp: new Date().toISOString(), // Data/hora atual em formato ISO
    };

    // Atualiza o estado do histórico
    setHistory((prev) => {
      // Adiciona o novo item ao início e mantém apenas os MAX_HISTORY primeiros
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
      
      try {
        // Guarda no localStorage como JSON
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        // Se houver erro ao guardar (ex: quota excedida), regista no console
        console.error("Error saving to localStorage:", error);
      }
      
      // Retorna o histórico atualizado
      return updated;
    });
  };

  /**
   * Função para limpar todo o histórico
   * Remove todos os cálculos guardados
   */
  const clearHistory = () => {
    // Limpa o estado local
    setHistory([]);
    
    try {
      // Remove a chave do localStorage
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Se houver erro, regista no console
      console.error("Error clearing localStorage:", error);
    }
  };

  /**
   * Função para obter estatísticas do histórico
   * Calcula totais e médias baseadas nos cálculos guardados
   * 
   * @returns Objeto com:
   *   - total: número total de cálculos
   *   - byType: objeto com contagem por tipo (energy, network, cpu)
   *   - avgResult: média dos resultados
   */
  const getStatistics = () => {
    // Total de cálculos no histórico
    const total = history.length;
    
    // Contagem de cálculos por tipo
    const byType = {
      energy: history.filter((h) => h.type === "energy").length,   // Número de cálculos de energia
      network: history.filter((h) => h.type === "network").length, // Número de cálculos de rede
      cpu: history.filter((h) => h.type === "cpu").length,        // Número de cálculos de CPU
    };
    
    // Média dos resultados (soma todos os resultados e divide pelo total)
    // Se não houver cálculos, a média é 0
    const avgResult = total > 0 
      ? history.reduce((sum, h) => sum + h.result, 0) / total 
      : 0;

    // Retorna as estatísticas
    return {
      total,      // Total de cálculos
      byType,     // Distribuição por tipo
      avgResult,  // Média dos resultados
    };
  };

  // Retorna as funções e dados para uso nos componentes
  return {
    history,          // Array com o histórico completo
    saveCalculation,  // Função para guardar um cálculo
    clearHistory,     // Função para limpar o histórico
    getStatistics,    // Função para obter estatísticas
  };
}

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
