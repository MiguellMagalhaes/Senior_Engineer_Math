/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém funções utilitárias para combinar classes CSS.
 * Utiliza clsx para combinar classes condicionalmente e tailwind-merge para resolver conflitos do Tailwind.
 */

// Importa clsx para combinar classes CSS condicionalmente
// clsx permite passar arrays, objetos e strings e combina tudo numa string de classes
import { clsx, type ClassValue } from "clsx"

// Importa twMerge do tailwind-merge para resolver conflitos de classes do Tailwind
// Por exemplo: "px-2 px-4" vira apenas "px-4" (a última prevalece)
import { twMerge } from "tailwind-merge"

/**
 * Função utilitária para combinar classes CSS de forma segura
 * Combina classes usando clsx e depois resolve conflitos do Tailwind com twMerge
 * 
 * @param inputs - Array de valores de classes (strings, objetos, arrays)
 * @returns String com classes CSS combinadas e conflitos resolvidos
 */
export function cn(...inputs: ClassValue[]) {
  // Primeiro combina todas as classes com clsx
  // Depois resolve conflitos do Tailwind com twMerge
  return twMerge(clsx(inputs))
}

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
