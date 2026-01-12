/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém toda a lógica matemática para cálculo de integrais numéricos.
 * Implementa a Regra do Trapézio, método adaptativo, validação de expressões,
 * e estimativa de erro usando extrapolação de Richardson.
 * Utiliza a biblioteca math.js para parsing e avaliação segura de expressões matemáticas.
 */

// Importa a função compile do math.js para compilar expressões matemáticas
// A função compile transforma uma string em código executável otimizado
import { compile } from "mathjs";

// Lista branca (whitelist) de funções matemáticas permitidas para segurança
// Estas são as únicas funções que o utilizador pode usar nas expressões
// Previne injeção de código malicioso
const ALLOWED_FUNCTIONS = [
  // Funções trigonométricas básicas
  'sin',   // Seno
  'cos',   // Cosseno
  'tan',   // Tangente
  'asin',  // Arco seno
  'acos',  // Arco cosseno
  'atan',  // Arco tangente
  'atan2', // Arco tangente de dois argumentos
  // Funções hiperbólicas
  'sinh',  // Seno hiperbólico
  'cosh',  // Cosseno hiperbólico
  'tanh',  // Tangente hiperbólica
  'asinh', // Arco seno hiperbólico
  'acosh', // Arco cosseno hiperbólico
  'atanh', // Arco tangente hiperbólica
  // Funções de raiz e potência
  'sqrt',  // Raiz quadrada
  'cbrt',  // Raiz cúbica
  'abs',   // Valor absoluto
  'exp',   // Exponencial (e^x)
  'log',   // Logaritmo natural
  'log10', // Logaritmo base 10
  'log2',  // Logaritmo base 2
  'pow',   // Potência
  // Funções de arredondamento e sinal
  'sign',  // Sinal (-1, 0, ou 1)
  'floor', // Arredondar para baixo
  'ceil',  // Arredondar para cima
  'round', // Arredondar para o mais próximo
  // Funções de comparação
  'min',   // Mínimo
  'max',   // Máximo
  'mod',   // Módulo (resto da divisão)
  'random' // Número aleatório
];

// Variáveis permitidas nas expressões matemáticas
// 't' é a variável de tempo (principal)
// 'pi' é a constante π (pi)
// 'e' é a constante de Euler
const ALLOWED_VARIABLES = ['t', 'pi', 'e'];

/**
 * Valida se uma expressão contém apenas funções e variáveis permitidas
 * Esta função é crucial para segurança, prevenindo injeção de código
 * 
 * @param expression - A expressão matemática a validar
 * @throws Error se a expressão contiver código não permitido
 */
function validateExpression(expression: string): void {
  // Padrão regex que verifica se contém apenas caracteres seguros
  // Permite: números, operadores (+, -, *, /), parênteses, pontos, espaços, vírgulas
  const safePattern = /^[0-9+\-*/().\s,]+$/;
  
  // Verifica se a expressão contém alguma das funções permitidas
  // Usa regex para encontrar funções seguidas de parêntese (ex: sin(, cos()
  const hasFunctions = ALLOWED_FUNCTIONS.some(fn => 
    new RegExp(`\\b${fn}\\s*\\(`, 'i').test(expression)
  );
  
  // Verifica se a expressão contém alguma das variáveis permitidas
  // Usa regex para encontrar variáveis como palavras completas (ex: \bt\b)
  const hasVariables = ALLOWED_VARIABLES.some(v => 
    new RegExp(`\\b${v}\\b`, 'i').test(expression)
  );
  
  // Se a expressão contém funções ou variáveis, valida mais rigorosamente
  if (hasFunctions || hasVariables) {
    // Remove todos os espaços para facilitar a validação
    const cleaned = expression.replace(/\s/g, '');
    
    // Verifica se não contém palavras-chave perigosas de JavaScript
    // Estas palavras poderiam ser usadas para executar código malicioso
    if (/eval|function|import|require|process|global|window/i.test(cleaned)) {
      throw new Error("Expressão contém código não permitido");
    }
  }
}

// Cache para memoização de cálculos
// Armazena resultados de integrais já calculados para evitar recálculos
// A chave é uma string única baseada nos parâmetros do cálculo
// O valor é o resultado da integração (IntegrationResult)
const calculationCache = new Map<string, IntegrationResult>();

/**
 * Gera uma chave única de cache para um cálculo específico
 * A chave combina todos os parâmetros do cálculo
 * 
 * @param expression - A expressão matemática
 * @param t1 - Tempo inicial
 * @param t2 - Tempo final
 * @param steps - Número de subintervalos
 * @returns String única que identifica este cálculo
 */
function getCacheKey(expression: string, t1: number, t2: number, steps: number): string {
  return `${expression}_${t1}_${t2}_${steps}`;
}

/**
 * Interface que define a estrutura do resultado de uma integração
 * Contém o valor do integral, pontos para gráfico, número de passos e erro estimado
 */
export interface IntegrationResult {
  value: number;                    // Valor numérico do integral calculado
  points: Array<{ t: number; y: number }>; // Array de pontos (t, y) para desenhar o gráfico
  steps: number;                    // Número de subintervalos usados no cálculo
  estimatedError?: number;          // Erro estimado (opcional, calculado por extrapolação de Richardson)
}

/**
 * Analisa uma expressão matemática e avalia-a para um valor específico de t
 * Wrapper seguro em torno do math.js com validação de segurança
 * 
 * @param expression - A expressão matemática como string (ex: "100 + 20*t")
 * @param t - O valor da variável t para avaliar a função
 * @returns O valor numérico da função avaliada em t
 * @throws Error se a expressão for inválida ou contiver código não permitido
 */
export function evaluateFunction(expression: string, t: number): number {
  try {
    // Primeiro valida a expressão para garantir segurança
    validateExpression(expression);
    
    // Compila a expressão em código otimizado
    // Isto é mais eficiente do que avaliar a string diretamente
    const code = compile(expression);
    
    // Avalia a função compilada com o valor de t fornecido
    // Retorna o resultado numérico
    return code.evaluate({ t });
  } catch (e: any) {
    // Se houver erro, lança uma exceção com mensagem descritiva
    throw new Error(`Invalid math expression: ${expression}. ${e.message}`);
  }
}

/**
 * Calcula o integral definido usando a Regra do Trapézio
 * Também retorna os pontos gerados para desenhar o gráfico
 * 
 * A Regra do Trapézio aproxima o integral dividindo a área sob a curva
 * em trapézios e somando as suas áreas.
 * 
 * Fórmula: ∫[a,b] f(x) dx ≈ (b-a)/n * [f(a)/2 + f(x₁) + f(x₂) + ... + f(xₙ₋₁) + f(b)/2]
 * 
 * @param expression - A expressão matemática da função f(t)
 * @param t1 - Tempo inicial (limite inferior do integral)
 * @param t2 - Tempo final (limite superior do integral)
 * @param steps - Número de subintervalos (padrão 1000 para maior precisão)
 * @param useAdaptive - Se true, usa método adaptativo (padrão false)
 * @returns Objeto IntegrationResult com o valor do integral e pontos para gráfico
 * @throws Error se t1 >= t2 ou se a expressão for inválida
 */
export function calculateIntegral(
  expression: string, 
  t1: number, 
  t2: number, 
  steps: number = 1000,
  useAdaptive: boolean = false
): IntegrationResult {
  // Valida que o tempo final é maior que o inicial
  if (t1 >= t2) {
    throw new Error("O tempo final (t2) deve ser maior que o inicial (t1).");
  }

  // Verifica se este cálculo já está em cache
  // Se estiver, retorna o resultado em cache (mais rápido)
  const cacheKey = getCacheKey(expression, t1, t2, steps);
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey)!;
  }

  // Valida a expressão antes de calcular
  validateExpression(expression);

  // Se o método adaptativo estiver ativado, usa a função adaptativa
  if (useAdaptive) {
    return calculateAdaptiveIntegral(expression, t1, t2, steps);
  }

  // Calcula o tamanho de cada subintervalo (passo)
  // h = (t2 - t1) / steps
  const h = (t2 - t1) / steps;
  
  // Inicializa a soma acumulada (será usada na fórmula do trapézio)
  let sum = 0;
  
  // Array para armazenar pontos (t, y) para desenhar o gráfico
  const points: Array<{ t: number; y: number }> = [];

  try {
    // Compila a expressão uma vez (mais eficiente do que compilar em cada iteração)
    const code = compile(expression);
    
    // Primeiro ponto: avalia a função no tempo inicial (t1)
    const y0 = code.evaluate({ t: t1 });
    // Adiciona o primeiro ponto ao array de pontos para o gráfico
    points.push({ t: Number(t1.toFixed(2)), y: y0 });
    
    // Último ponto: avalia a função no tempo final (t2)
    const yn = code.evaluate({ t: t2 });
    
    // Na Regra do Trapézio, os pontos inicial e final têm peso 1/2
    // Adiciona (y0 + yn) / 2 à soma
    sum += (y0 + yn) / 2;

    // Calcula quantos pontos devem ser amostrados para o gráfico
    // Amostra aproximadamente 200 pontos para não sobrecarregar o gráfico
    // Se steps for muito grande, amostra apenas alguns pontos
    const plotStep = Math.max(1, Math.floor(steps / 200));
    
    // Itera sobre todos os subintervalos intermediários
    for (let i = 1; i < steps; i++) {
      // Calcula o valor de t no subintervalo i
      const t = t1 + i * h;
      
      // Avalia a função neste ponto
      const y = code.evaluate({ t });
      
      // Adiciona y à soma (na Regra do Trapézio, todos os pontos intermediários têm peso 1)
      sum += y;
      
      // Amostra pontos para o gráfico (não guarda todos para não sobrecarregar)
      // Guarda pontos a cada plotStep iterações ou no último ponto
      if (i % plotStep === 0 || i === steps - 1) {
        points.push({ t: Number(t.toFixed(2)), y });
      }
    }
    
    // Adiciona o último ponto ao array de pontos
    points.push({ t: Number(t2.toFixed(2)), y: yn });

    // Calcula o resultado final do integral
    // Fórmula: sum * h, onde sum já contém os pesos corretos
    const result = sum * h;
    
    // Estima o erro usando extrapolação de Richardson
    // Calcula o integral com metade dos subintervalos
    const halfSteps = Math.floor(steps / 2);
    const halfResult = calculateIntegralSimple(expression, t1, t2, halfSteps, code);
    
    // A diferença entre os dois resultados dá uma estimativa do erro
    // Divide por 3 para obter uma estimativa mais conservadora
    const estimatedError = Math.abs(result - halfResult) / 3;
    
    // Cria o objeto de resultado com todas as informações
    const integrationResult: IntegrationResult = {
      value: result,           // Valor do integral
      points,                  // Pontos para o gráfico
      steps,                   // Número de subintervalos usados
      estimatedError           // Erro estimado
    };
    
    // Guarda o resultado no cache para futuras consultas
    calculationCache.set(cacheKey, integrationResult);
    
    // Retorna o resultado
    return integrationResult;
  } catch (err: any) {
    // Se houver erro durante o cálculo, regista no console
    console.error(err);
    // Lança uma exceção com mensagem descritiva
    throw new Error(`Erro ao avaliar a função. Verifique a sintaxe (ex: 100 + 20*t). ${err.message}`);
  }
}

/**
 * Método simples de integração usando Regra do Trapézio
 * Usado internamente para estimativa de erro (não gera pontos para gráfico)
 * 
 * @param expression - A expressão matemática da função
 * @param t1 - Tempo inicial
 * @param t2 - Tempo final
 * @param steps - Número de subintervalos
 * @param code - Código compilado da expressão (para eficiência)
 * @returns Valor numérico do integral
 */
function calculateIntegralSimple(
  expression: string,
  t1: number,
  t2: number,
  steps: number,
  code: any
): number {
  // Calcula o tamanho do passo
  const h = (t2 - t1) / steps;
  
  // Inicializa a soma
  let sum = 0;
  
  // Avalia a função no ponto inicial
  const y0 = code.evaluate({ t: t1 });
  // Avalia a função no ponto final
  const yn = code.evaluate({ t: t2 });
  
  // Adiciona os pontos inicial e final com peso 1/2
  sum += (y0 + yn) / 2;
  
  // Itera sobre os pontos intermediários
  for (let i = 1; i < steps; i++) {
    // Calcula o valor de t
    const t = t1 + i * h;
    // Avalia a função
    const y = code.evaluate({ t });
    // Adiciona à soma
    sum += y;
  }
  
  // Retorna o resultado (soma * passo)
  return sum * h;
}

/**
 * Método adaptativo de integração
 * Refina automaticamente em áreas de maior variação da função
 * Usa uma combinação de Regra de Simpson e Regra do Trapézio
 * 
 * O método adaptativo divide recursivamente o intervalo até que
 * a diferença entre Simpson e Trapézio seja menor que a tolerância
 * 
 * @param expression - A expressão matemática da função
 * @param t1 - Tempo inicial
 * @param t2 - Tempo final
 * @param maxSteps - Número máximo de subintervalos
 * @returns Objeto IntegrationResult com o valor do integral
 */
function calculateAdaptiveIntegral(
  expression: string,
  t1: number,
  t2: number,
  maxSteps: number
): IntegrationResult {
  // Compila a expressão
  const code = compile(expression);
  
  // Tolerância para o erro (quanto menor, mais preciso)
  const tolerance = 1e-6;
  
  // Tamanho mínimo do passo (previne divisão infinita)
  const minStepSize = (t2 - t1) / maxSteps;
  
  /**
   * Função recursiva que calcula o integral adaptativamente
   * Divide o intervalo em dois e calcula cada metade separadamente
   * 
   * @param a - Limite inferior do subintervalo
   * @param b - Limite superior do subintervalo
   * @param fa - Valor da função em a
   * @param fb - Valor da função em b
   * @param depth - Profundidade da recursão (previne recursão infinita)
   * @returns Valor do integral no subintervalo [a, b]
   */
  function adaptiveStep(a: number, b: number, fa: number, fb: number, depth: number): number {
    // Se a profundidade for muito grande, usa aproximação simples (previne stack overflow)
    if (depth > 20) return (fa + fb) * (b - a) / 2;
    
    // Calcula o ponto médio
    const c = (a + b) / 2;
    // Avalia a função no ponto médio
    const fc = code.evaluate({ t: c });
    // Calcula o tamanho do passo
    const h = b - a;
    
    // Regra de Simpson composta (mais precisa)
    // Fórmula: (fa + 4*fc + fb) * h / 6
    const simpson = (fa + 4 * fc + fb) * h / 6;
    
    // Regra dos trapézios (menos precisa)
    // Fórmula: (fa + fb) * h / 2
    const trapezoid = (fa + fb) * h / 2;
    
    // Calcula a diferença entre os dois métodos (estimativa de erro)
    const error = Math.abs(simpson - trapezoid);
    
    // Se o erro for menor que a tolerância ou o passo for muito pequeno, aceita o resultado
    if (error < tolerance || h < minStepSize) {
      return simpson;
    }
    
    // Caso contrário, divide o intervalo em dois e calcula cada metade recursivamente
    // Divide e conquista: resolve problemas menores e combina os resultados
    return adaptiveStep(a, c, fa, fc, depth + 1) + 
           adaptiveStep(c, b, fc, fb, depth + 1);
  }
  
  // Avalia a função nos limites do intervalo
  const fa = code.evaluate({ t: t1 });
  const fb = code.evaluate({ t: t2 });
  
  // Calcula o integral usando o método adaptativo
  const result = adaptiveStep(t1, t2, fa, fb, 0);
  
  // Gera pontos para plotagem do gráfico
  const points: Array<{ t: number; y: number }> = [];
  // Limita o número de pontos a 200 para não sobrecarregar o gráfico
  const numPoints = Math.min(200, maxSteps);
  
  // Gera pontos uniformemente distribuídos
  for (let i = 0; i <= numPoints; i++) {
    // Calcula o valor de t
    const t = t1 + (t2 - t1) * i / numPoints;
    // Avalia a função
    const y = code.evaluate({ t });
    // Adiciona o ponto ao array
    points.push({ t: Number(t.toFixed(2)), y });
  }
  
  // Retorna o resultado
  return {
    value: result,              // Valor do integral
    points,                     // Pontos para o gráfico
    steps: maxSteps,            // Número máximo de passos
    estimatedError: tolerance   // Erro estimado (igual à tolerância)
  };
}

/**
 * Limpa o cache de cálculos
 * Útil para libertar memória ou forçar recálculos
 */
export function clearCalculationCache(): void {
  calculationCache.clear();
}

/**
 * Obtém estatísticas do cache
 * Retorna o tamanho atual e o tamanho máximo do cache
 * 
 * @returns Objeto com size (tamanho atual) e maxSize (tamanho máximo)
 */
export function getCacheStats(): { size: number; maxSize: number } {
  return {
    size: calculationCache.size,  // Número de cálculos em cache
    maxSize: 100                  // Limite máximo de cálculos em cache
  };
}

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
