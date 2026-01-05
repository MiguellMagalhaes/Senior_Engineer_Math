/**
 * Trabalho realizado por Miguel Magalhães, aluno de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o componente FunctionChart.
 * Implementa a visualização gráfica da função integrada usando a biblioteca Recharts.
 * Mostra a área sob a curva, que representa visualmente o valor do integral.
 * Suporta estados de loading e vazio quando não há dados.
 */

// Importa o hook useMemo do React para memoização (otimização de performance)
import { useMemo } from "react";

// Importa componentes da biblioteca Recharts para criar gráficos
import {
  AreaChart,      // Gráfico de área (mostra área sob a curva)
  Area,           // Componente de área (a curva preenchida)
  XAxis,          // Eixo X (horizontal)
  YAxis,          // Eixo Y (vertical)
  CartesianGrid, // Grade de fundo do gráfico
  Tooltip,       // Tooltip que aparece ao passar o rato
  ResponsiveContainer, // Container responsivo que ajusta o tamanho
} from "recharts";

// Importa o componente Card da biblioteca de UI
import { Card } from "@/components/ui/card";

/**
 * Interface que define as props do componente FunctionChart
 */
interface FunctionChartProps {
  data: Array<{ t: number; y: number }>; // Array de pontos (t, y) para desenhar o gráfico
  color?: string;                        // Cor do gráfico (opcional, padrão: cor primária)
  yLabel?: string;                       // Etiqueta do eixo Y (opcional, padrão: "f(t)")
  xLabel?: string;                       // Etiqueta do eixo X (opcional, padrão: "t (tempo)")
  isLoading?: boolean;                   // Se está a carregar (opcional, padrão: false)
}

/**
 * Componente FunctionChart
 * Renderiza um gráfico de área que mostra a função e a área sob a curva
 */
export function FunctionChart({ 
  data,                    // Dados recebidos como prop
  color = "hsl(var(--primary))", // Cor padrão (cor primária do tema)
  yLabel = "f(t)",         // Etiqueta Y padrão
  xLabel = "t (tempo)",    // Etiqueta X padrão
  isLoading = false         // Estado de loading padrão
}: FunctionChartProps) {
  
  // Se estiver a carregar, mostra um placeholder com animação
  if (isLoading) {
    return (
      // Container com animação de pulso (loading)
      <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-xl border border-border/50 flex items-center justify-center">
        {/* Texto de loading */}
        <span className="text-muted-foreground">Calculando gráfico...</span>
      </div>
    );
  }

  // Se não houver dados, mostra mensagem de estado vazio
  if (!data.length) {
    return (
      // Container vazio com borda tracejada
      <div className="h-[300px] w-full bg-muted/10 rounded-xl border border-border/50 flex items-center justify-center border-dashed">
        {/* Mensagem para o utilizador */}
        <span className="text-muted-foreground text-sm">Insira os dados para visualizar o gráfico</span>
      </div>
    );
  }

  // Retorna o gráfico completo
  return (
    // Card que contém o gráfico
    <Card className="p-6 border-border shadow-sm bg-card/50 backdrop-blur-sm">
      {/* Cabeçalho do gráfico */}
      <div className="mb-4 flex items-center justify-between">
        {/* Título do gráfico */}
        <h3 className="text-sm font-medium text-muted-foreground">Representação Gráfica</h3>
        {/* Legenda de cores */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {/* Indicador de cor (círculo pequeno) */}
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
          {/* Texto da legenda: yLabel vs xLabel */}
          {yLabel} vs {xLabel}
        </div>
      </div>
      
      {/* Container do gráfico com altura fixa */}
      <div className="h-[280px] w-full">
        {/* Container responsivo que ajusta o tamanho automaticamente */}
        <ResponsiveContainer width="100%" height="100%">
          {/* Gráfico de área */}
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {/* Define gradiente linear para preencher a área sob a curva */}
            <defs>
              {/* Gradiente com ID "colorY" */}
              <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                {/* Parada superior: cor sólida com opacidade 0.3 */}
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                {/* Parada inferior: cor transparente (opacidade 0) */}
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            {/* Grade de fundo (linhas de referência) */}
            <CartesianGrid 
              strokeDasharray="3 3"        // Padrão de traço (3px traço, 3px espaço)
              vertical={false}             // Sem linhas verticais (apenas horizontais)
              stroke="hsl(var(--border))"  // Cor das linhas (cor de borda do tema)
            />
            
            {/* Eixo X (horizontal) - representa o tempo (t) */}
            <XAxis 
              dataKey="t"                  // Chave dos dados para o eixo X
              stroke="hsl(var(--muted-foreground))" // Cor do eixo
              fontSize={12}                // Tamanho da fonte
              tickLine={false}             // Sem linhas de marcação
              axisLine={false}             // Sem linha do eixo
              tickFormatter={(val) => `t=${val}`} // Formata os valores como "t=valor"
            />
            
            {/* Eixo Y (vertical) - representa o valor da função (y) */}
            <YAxis 
              stroke="hsl(var(--muted-foreground))" // Cor do eixo
              fontSize={12}                // Tamanho da fonte
              tickLine={false}             // Sem linhas de marcação
              axisLine={false}             // Sem linha do eixo
              tickFormatter={(val) => typeof val === 'number' ? val.toFixed(1) : val} // Formata números com 1 casa decimal
            />
            
            {/* Tooltip (popup informativo ao passar o rato) */}
            <Tooltip
              // Estilo do conteúdo do tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",  // Cor de fundo
                borderColor: "hsl(var(--border))",      // Cor da borda
                borderRadius: "var(--radius)",          // Raio das bordas
                boxShadow: "var(--shadow-md)",          // Sombra
              }}
              // Estilo dos itens do tooltip
              itemStyle={{ color: "hsl(var(--foreground))" }}
              // Estilo da etiqueta do tooltip
              labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.25rem" }}
              // Formata o valor exibido (4 casas decimais)
              formatter={(value: number) => [value.toFixed(4), yLabel]}
              // Formata a etiqueta (mostra xLabel: valor)
              labelFormatter={(label) => `${xLabel}: ${label}`}
            />
            
            {/* Área sob a curva (o preenchimento do gráfico) */}
            <Area
              type="monotone"              // Tipo de interpolação (suave)
              dataKey="y"                  // Chave dos dados para o eixo Y
              stroke={color}               // Cor da linha da curva
              strokeWidth={2}               // Espessura da linha
              fillOpacity={1}              // Opacidade do preenchimento (total)
              fill="url(#colorY)"          // Preenche com o gradiente definido acima
              animationDuration={1000}      // Duração da animação (1 segundo)
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

/**
 * Trabalho realizado por Miguel Magalhães, aluno de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
