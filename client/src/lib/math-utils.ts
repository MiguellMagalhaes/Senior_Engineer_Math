import { compile } from "mathjs";

export interface IntegrationResult {
  value: number;
  points: Array<{ t: number; y: number }>;
}

/**
 * Parses a function string and evaluates it at a specific t.
 * Safe wrapper around mathjs.
 */
export function evaluateFunction(expression: string, t: number): number {
  try {
    const code = compile(expression);
    return code.evaluate({ t });
  } catch (e) {
    throw new Error(`Invalid math expression: ${expression}`);
  }
}

/**
 * Calculates the definite integral using the Trapezoidal Rule.
 * Also returns the points generated for plotting.
 * 
 * @param expression The function string f(t)
 * @param t1 Start time
 * @param t2 End time
 * @param steps Number of intervals (default 100)
 */
export function calculateIntegral(
  expression: string, 
  t1: number, 
  t2: number, 
  steps: number = 100
): IntegrationResult {
  if (t1 >= t2) {
    throw new Error("O tempo final (t2) deve ser maior que o inicial (t1).");
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

    // Intermediate points
    for (let i = 1; i < steps; i++) {
      const t = t1 + i * h;
      const y = code.evaluate({ t });
      sum += y;
      points.push({ t: Number(t.toFixed(2)), y });
    }
    
    points.push({ t: Number(t2.toFixed(2)), y: yn });

    const result = sum * h;
    
    return {
      value: result,
      points
    };
  } catch (err) {
    console.error(err);
    throw new Error("Erro ao avaliar a função. Verifique a sintaxe (ex: 100 + 20*t).");
  }
}
