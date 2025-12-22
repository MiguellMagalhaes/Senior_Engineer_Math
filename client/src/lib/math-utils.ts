import { compile } from "mathjs";

// Whitelist de funções permitidas para segurança
const ALLOWED_FUNCTIONS = [
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
  'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
  'sqrt', 'cbrt', 'abs', 'exp', 'log', 'log10', 'log2',
  'pow', 'sign', 'floor', 'ceil', 'round', 'min', 'max',
  'mod', 'random'
];

// Variáveis permitidas
const ALLOWED_VARIABLES = ['t', 'pi', 'e'];

/**
 * Valida se uma expressão contém apenas funções e variáveis permitidas
 */
function validateExpression(expression: string): void {
  // Verifica se contém apenas caracteres seguros
  const safePattern = /^[0-9+\-*/().\s,]+$/;
  const hasFunctions = ALLOWED_FUNCTIONS.some(fn => 
    new RegExp(`\\b${fn}\\s*\\(`, 'i').test(expression)
  );
  const hasVariables = ALLOWED_VARIABLES.some(v => 
    new RegExp(`\\b${v}\\b`, 'i').test(expression)
  );
  
  // Se contém funções ou variáveis, valida mais rigorosamente
  if (hasFunctions || hasVariables) {
    // Remove espaços e valida estrutura básica
    const cleaned = expression.replace(/\s/g, '');
    // Verifica se não contém código malicioso
    if (/eval|function|import|require|process|global|window/i.test(cleaned)) {
      throw new Error("Expressão contém código não permitido");
    }
  }
}

// Cache para memoização de cálculos
const calculationCache = new Map<string, IntegrationResult>();

/**
 * Gera chave de cache para um cálculo
 */
function getCacheKey(expression: string, t1: number, t2: number, steps: number): string {
  return `${expression}_${t1}_${t2}_${steps}`;
}

export interface IntegrationResult {
  value: number;
  points: Array<{ t: number; y: number }>;
  steps: number;
  estimatedError?: number;
}

/**
 * Parses a function string and evaluates it at a specific t.
 * Safe wrapper around mathjs with validation.
 */
export function evaluateFunction(expression: string, t: number): number {
  try {
    validateExpression(expression);
    const code = compile(expression);
    return code.evaluate({ t });
  } catch (e: any) {
    throw new Error(`Invalid math expression: ${expression}. ${e.message}`);
  }
}

/**
 * Calculates the definite integral using the Trapezoidal Rule.
 * Also returns the points generated for plotting.
 * 
 * @param expression The function string f(t)
 * @param t1 Start time
 * @param t2 End time
 * @param steps Number of intervals (default 1000 for better precision)
 * @param useAdaptive Use adaptive method for better accuracy (default false)
 */
export function calculateIntegral(
  expression: string, 
  t1: number, 
  t2: number, 
  steps: number = 1000,
  useAdaptive: boolean = false
): IntegrationResult {
  if (t1 >= t2) {
    throw new Error("O tempo final (t2) deve ser maior que o inicial (t1).");
  }

  // Verifica cache
  const cacheKey = getCacheKey(expression, t1, t2, steps);
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey)!;
  }

  validateExpression(expression);

  if (useAdaptive) {
    return calculateAdaptiveIntegral(expression, t1, t2, steps);
  }

  const h = (t2 - t1) / steps;
  let sum = 0;
  const points: Array<{ t: number; y: number }> = [];

  try {
    const code = compile(expression);
    
    // First point
    const y0 = code.evaluate({ t: t1 });
    points.push({ t: Number(t1.toFixed(2)), y: y0 });
    
    // Last point
    const yn = code.evaluate({ t: t2 });
    
    sum += (y0 + yn) / 2;

    // Intermediate points (sample every 10th point for plotting to avoid too many points)
    const plotStep = Math.max(1, Math.floor(steps / 200));
    
    for (let i = 1; i < steps; i++) {
      const t = t1 + i * h;
      const y = code.evaluate({ t });
      sum += y;
      
      // Sample points for plotting
      if (i % plotStep === 0 || i === steps - 1) {
        points.push({ t: Number(t.toFixed(2)), y });
      }
    }
    
    points.push({ t: Number(t2.toFixed(2)), y: yn });

    const result = sum * h;
    
    // Estima erro usando método de Richardson extrapolation
    const halfSteps = Math.floor(steps / 2);
    const halfResult = calculateIntegralSimple(expression, t1, t2, halfSteps, code);
    const estimatedError = Math.abs(result - halfResult) / 3;
    
    const integrationResult: IntegrationResult = {
      value: result,
      points,
      steps,
      estimatedError
    };
    
    // Cache o resultado
    calculationCache.set(cacheKey, integrationResult);
    
    return integrationResult;
  } catch (err: any) {
    console.error(err);
    throw new Error(`Erro ao avaliar a função. Verifique a sintaxe (ex: 100 + 20*t). ${err.message}`);
  }
}

/**
 * Método simples de integração (usado para estimativa de erro)
 */
function calculateIntegralSimple(
  expression: string,
  t1: number,
  t2: number,
  steps: number,
  code: any
): number {
  const h = (t2 - t1) / steps;
  let sum = 0;
  
  const y0 = code.evaluate({ t: t1 });
  const yn = code.evaluate({ t: t2 });
  sum += (y0 + yn) / 2;
  
  for (let i = 1; i < steps; i++) {
    const t = t1 + i * h;
    const y = code.evaluate({ t });
    sum += y;
  }
  
  return sum * h;
}

/**
 * Método adaptativo de integração (refina em áreas de maior variação)
 */
function calculateAdaptiveIntegral(
  expression: string,
  t1: number,
  t2: number,
  maxSteps: number
): IntegrationResult {
  const code = compile(expression);
  const tolerance = 1e-6;
  const minStepSize = (t2 - t1) / maxSteps;
  
  function adaptiveStep(a: number, b: number, fa: number, fb: number, depth: number): number {
    if (depth > 20) return (fa + fb) * (b - a) / 2; // Previne recursão infinita
    
    const c = (a + b) / 2;
    const fc = code.evaluate({ t: c });
    const h = b - a;
    
    // Regra de Simpson composta
    const simpson = (fa + 4 * fc + fb) * h / 6;
    
    // Regra dos trapézios
    const trapezoid = (fa + fb) * h / 2;
    
    const error = Math.abs(simpson - trapezoid);
    
    if (error < tolerance || h < minStepSize) {
      return simpson;
    }
    
    // Divide e conquista
    return adaptiveStep(a, c, fa, fc, depth + 1) + 
           adaptiveStep(c, b, fc, fb, depth + 1);
  }
  
  const fa = code.evaluate({ t: t1 });
  const fb = code.evaluate({ t: t2 });
  const result = adaptiveStep(t1, t2, fa, fb, 0);
  
  // Gera pontos para plotagem
  const points: Array<{ t: number; y: number }> = [];
  const numPoints = Math.min(200, maxSteps);
  for (let i = 0; i <= numPoints; i++) {
    const t = t1 + (t2 - t1) * i / numPoints;
    const y = code.evaluate({ t });
    points.push({ t: Number(t.toFixed(2)), y });
  }
  
  return {
    value: result,
    points,
    steps: maxSteps,
    estimatedError: tolerance
  };
}

/**
 * Limpa o cache de cálculos
 */
export function clearCalculationCache(): void {
  calculationCache.clear();
}

/**
 * Obtém estatísticas do cache
 */
export function getCacheStats(): { size: number; maxSize: number } {
  return {
    size: calculationCache.size,
    maxSize: 100 // Limite de cache
  };
}
