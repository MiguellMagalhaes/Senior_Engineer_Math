import { useState, useEffect } from "react";

// Simple hook to manage calculation history in localStorage
export interface CalculationHistoryItem {
  id: string;
  type: "energy" | "network" | "cpu";
  functionExpression: string;
  t1: number;
  t2: number;
  result: number;
  timestamp: string;
}

const STORAGE_KEY = "calculation-history";
const MAX_HISTORY = 100; // Keep last 100 calculations

export function useLocalStorage() {
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading history from localStorage:", error);
    }
  }, []);

  // Save calculation to history
  const saveCalculation = (item: Omit<CalculationHistoryItem, "id" | "timestamp">) => {
    const newItem: CalculationHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      return updated;
    });
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  // Get statistics
  const getStatistics = () => {
    const total = history.length;
    const byType = {
      energy: history.filter((h) => h.type === "energy").length,
      network: history.filter((h) => h.type === "network").length,
      cpu: history.filter((h) => h.type === "cpu").length,
    };
    const avgResult = total > 0 
      ? history.reduce((sum, h) => sum + h.result, 0) / total 
      : 0;

    return {
      total,
      byType,
      avgResult,
    };
  };

  return {
    history,
    saveCalculation,
    clearHistory,
    getStatistics,
  };
}

