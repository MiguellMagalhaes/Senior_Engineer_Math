/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o componente MathResultCard.
 * Implementa o card visual que exibe o resultado do cálculo do integral.
 * Mostra o valor calculado, unidade, interpretação física, e informações técnicas.
 * Inclui animações e efeitos visuais para melhorar a experiência do utilizador.
 */

// Importa ReactNode do React (tipo para elementos React)
import { ReactNode } from "react";

// Importa a função cn (classNames) para combinar classes CSS
import { cn } from "@/lib/utils";

// Importa ícones da biblioteca lucide-react
// ArrowRight: seta para a direita, Activity: ícone de atividade
// TrendingUp: ícone de tendência crescente, Cpu: ícone de CPU
import { ArrowRight, Activity, TrendingUp, Cpu } from "lucide-react";

/**
 * Interface que define as props do componente MathResultCard
 */
interface MathResultCardProps {
  title: string;              // Título do resultado (ex: "Consumo Energético Total")
  value: string;              // Valor formatado do resultado (ex: "1250.50")
  unit: string;               // Unidade de medida (ex: "Wh", "Mb", "unidades de carga")
  interpretation: string;     // Interpretação física do resultado
  icon?: "energy" | "network" | "cpu"; // Tipo de ícone a usar (opcional)
  secondaryValue?: string;    // Valor secundário (conversão, ex: "1.25 kWh") (opcional)
  estimatedError?: number;    // Erro estimado do cálculo (opcional)
  steps?: number;             // Número de subintervalos usados (opcional)
}

/**
 * Componente MathResultCard
 * Renderiza um card visual com o resultado do cálculo
 */
export function MathResultCard({ 
  title,              // Título recebido como prop
  value,              // Valor recebido como prop
  unit,               // Unidade recebida como prop
  interpretation,     // Interpretação recebida como prop
  icon = "energy",    // Ícone padrão: "energy"
  secondaryValue,     // Valor secundário (opcional)
  estimatedError,     // Erro estimado (opcional)
  steps               // Número de passos (opcional)
}: MathResultCardProps) {
  
  /**
   * Função que retorna o ícone apropriado baseado no tipo
   * Cada tipo de cálculo tem um ícone diferente
   * 
   * @returns Elemento React com o ícone
   */
  const getIcon = () => {
    // Switch baseado no tipo de ícone
    switch (icon) {
      case "energy":
        // Ícone de tendência crescente (amarelo) para energia
        return <TrendingUp className="w-5 h-5 text-amber-500" />;
      case "network":
        // Ícone de atividade (azul) para rede
        return <Activity className="w-5 h-5 text-blue-500" />;
      case "cpu":
        // Ícone de CPU (roxo) para carga computacional
        return <Cpu className="w-5 h-5 text-purple-500" />;
      default:
        // Ícone padrão (atividade) se o tipo não for reconhecido
        return <Activity className="w-5 h-5 text-primary" />;
    }
  };

  // Retorna o JSX do card
  return (
    // Container principal do card com animação de entrada
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 overflow-hidden relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Elemento decorativo: círculo grande no canto superior direito */}
      {/* Aumenta de tamanho quando o rato passa por cima (hover) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
      
      {/* Cabeçalho do card: ícone e título */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        {/* Container do ícone com fundo colorido */}
        <div className="p-2 bg-primary/10 rounded-lg">
          {/* Renderiza o ícone apropriado */}
          {getIcon()}
        </div>
        {/* Título do resultado */}
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      {/* Seção principal: valor e informações */}
      <div className="mb-6 relative z-10">
        {/* Valor principal e unidade */}
        <div className="flex items-baseline gap-2">
          {/* Valor numérico grande em fonte monoespaçada */}
          <span className="text-4xl font-bold tracking-tight text-primary font-mono">
            {value}
          </span>
          {/* Unidade de medida */}
          <span className="text-muted-foreground font-medium">{unit}</span>
        </div>
        
        {/* Valor secundário (conversão) - só aparece se existir */}
        {secondaryValue && (
          <div className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
            {/* Ícone de seta */}
            <ArrowRight className="w-3 h-3" />
            {/* Valor secundário */}
            {secondaryValue}
          </div>
        )}
        
        {/* Informações técnicas - só aparecem se existirem */}
        {(estimatedError !== undefined || steps) && (
          <div className="mt-2 text-xs text-muted-foreground space-y-1">
            {/* Número de subintervalos - só aparece se steps existir */}
            {steps && <div>Subintervalos: {steps}</div>}
            {/* Erro estimado - só aparece se estimatedError existir */}
            {estimatedError !== undefined && (
              <div>Erro estimado: {estimatedError.toExponential(2)}</div>
            )}
          </div>
        )}
      </div>

      {/* Seção de interpretação física */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border/50 relative z-10">
        {/* Título da seção */}
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Interpretação Física
        </h4>
        {/* Texto da interpretação em itálico e serifado */}
        <p className="text-sm text-foreground/80 leading-relaxed font-serif italic">
          "{interpretation}"
        </p>
      </div>
    </div>
  );
}

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
