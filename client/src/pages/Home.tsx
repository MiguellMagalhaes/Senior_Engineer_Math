/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém a página principal (Home) da aplicação.
 * Implementa a interface completa do simulador de integrais, incluindo:
 * - Três contextos de aplicação (Energia, Rede, CPU)
 * - Formulário de entrada de parâmetros
 * - Visualização de resultados e gráficos
 * - Histórico de cálculos
 * - Estatísticas
 */

// Importa o hook useState do React para gerir estado local do componente
import { useState } from "react";

// Importa os componentes de Tabs (separadores) da biblioteca de UI
// TabsList: container dos separadores, TabsTrigger: botão de cada separador, TabsContent: conteúdo de cada separador
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importa o componente Card para criar cartões visuais
import { Card } from "@/components/ui/card";

// Importa o hook useToast para exibir notificações toast na interface
import { useToast } from "@/hooks/use-toast";

// Importa o hook useLocalStorage para gerir o histórico de cálculos
import { useLocalStorage } from "@/hooks/use-local-storage";

// Importa a função calculateIntegral e o tipo IntegrationResult
// calculateIntegral: calcula o integral numérico
// IntegrationResult: tipo que define a estrutura do resultado
import { calculateIntegral, type IntegrationResult } from "@/lib/math-utils";

// Importa o componente CalculationForm (formulário de entrada)
import { CalculationForm } from "@/components/CalculationForm";

// Importa o componente FunctionChart (gráfico da função)
import { FunctionChart } from "@/components/FunctionChart";

// Importa o componente MathResultCard (card de resultados)
import { MathResultCard } from "@/components/MathResultCard";

// Importa ícones da biblioteca lucide-react
// Zap: ícone de energia/raio, Network: ícone de rede, Cpu: ícone de CPU
// GraduationCap: ícone de graduação, Calculator: ícone de calculadora, History: ícone de histórico
import { Zap, Network, Cpu, GraduationCap, Calculator, History } from "lucide-react";

// Importa o componente Button da biblioteca de UI
import { Button } from "@/components/ui/button";

/**
 * Componente Home - Página principal da aplicação
 * Este é o componente principal que renderiza toda a interface do simulador
 */
export default function Home() {
  // Hook useToast retorna a função toast para exibir notificações
  const { toast } = useToast();
  
  // Hook useLocalStorage retorna funções e dados para gerir o histórico
  // history: array com o histórico de cálculos
  // saveCalculation: função para guardar um cálculo no histórico
  // clearHistory: função para limpar o histórico
  // getStatistics: função para obter estatísticas do histórico
  const { history, saveCalculation, clearHistory, getStatistics } = useLocalStorage();

  // Estado para armazenar o resultado do cálculo do integral
  // Inicialmente é null (sem resultado)
  const [result, setResult] = useState<IntegrationResult | null>(null);
  
  // Estado para controlar qual separador (tab) está ativo
  // Valores possíveis: "energy", "network", "cpu"
  // Inicialmente é "energy" (Consumo Energético)
  const [activeTab, setActiveTab] = useState("energy");
  
  // Estado para indicar se um cálculo está em progresso
  // Usado para mostrar loading e desabilitar botões durante o cálculo
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Estado para controlar se o histórico deve ser exibido
  // true: histórico visível, false: histórico oculto
  const [showHistory, setShowHistory] = useState(false);

  /**
   * Função handler para processar o cálculo do integral
   * É chamada quando o utilizador submete o formulário
   * 
   * @param values - Objeto com os valores do formulário:
   *   - functionExpression: expressão matemática (ex: "100 + 20*t")
   *   - t1: tempo inicial
   *   - t2: tempo final
   *   - steps: número de subintervalos (opcional, padrão 1000)
   *   - useAdaptive: se deve usar método adaptativo (opcional, padrão false)
   */
  const handleCalculate = async (values: any) => {
    // Define que um cálculo está em progresso
    setIsCalculating(true);
    
    // Limpa o resultado anterior para mostrar estado de loading
    setResult(null);

    try {
      // Executa o cálculo do integral no lado do cliente
      // calculateIntegral é uma função pura que faz todo o cálculo matemático
      const calcResult = calculateIntegral(
        values.functionExpression,  // Expressão matemática da função
        values.t1,                  // Tempo inicial
        values.t2,                  // Tempo final
        values.steps || 1000,       // Número de subintervalos (padrão 1000)
        values.useAdaptive || false // Se usa método adaptativo (padrão false)
      );
      
      // Simula um pequeno atraso para melhor experiência do utilizador
      // Isto permite que o utilizador veja o estado de loading
      // O atraso de 600ms dá feedback visual de que algo está a acontecer
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Guarda o resultado no estado do componente
      setResult(calcResult);

      // Guarda o cálculo no histórico (localStorage)
      // Isto permite que o utilizador veja cálculos anteriores
      saveCalculation({
        type: activeTab as "energy" | "network" | "cpu", // Tipo baseado no separador ativo
        functionExpression: values.functionExpression,  // Expressão usada
        t1: values.t1,                                  // Tempo inicial
        t2: values.t2,                                  // Tempo final
        result: calcResult.value,                       // Valor do integral calculado
      });

      // Cria mensagem de erro estimado se disponível
      // O erro estimado é calculado usando extrapolação de Richardson
      const errorMsg = calcResult.estimatedError 
        ? ` (Erro estimado: ${calcResult.estimatedError.toExponential(2)})` // Formato científico
        : ''; // Sem erro estimado

      // Exibe notificação de sucesso
      toast({
        title: "Cálculo realizado com sucesso!",
        description: `Integral calculado no intervalo [${values.t1}, ${values.t2}]${errorMsg}.`,
      });
    } catch (error: any) {
      // Se houver erro durante o cálculo, exibe notificação de erro
      toast({
        variant: "destructive", // Variante destrutiva (vermelha) para erros
        title: "Erro no cálculo",
        description: error.message, // Mensagem de erro da exceção
      });
    } finally {
      // Sempre define isCalculating como false, mesmo se houver erro
      // Isto garante que o botão não fica desabilitado permanentemente
      setIsCalculating(false);
    }
  };

  /**
   * Função handler para quando o utilizador muda de separador (tab)
   * Limpa o resultado quando muda de contexto (energia, rede, CPU)
   * 
   * @param value - O valor do separador selecionado ("energy", "network", ou "cpu")
   */
  const onTabChange = (value: string) => {
    // Atualiza o separador ativo
    setActiveTab(value);
    
    // Limpa o resultado anterior quando muda de separador
    // Isto evita mostrar resultados do contexto anterior
    setResult(null);
  };

  /**
   * Função que retorna a configuração de exibição baseada no separador ativo
   * Cada contexto (energia, rede, CPU) tem diferentes:
   * - Título
   * - Unidade de medida
   * - Interpretação física
   * - Cor do gráfico
   * - Etiqueta do eixo Y
   * 
   * @returns Objeto com configuração de exibição ou null se não houver resultado
   */
  const getTabConfig = () => {
    // Se não houver resultado, retorna null
    if (!result) return null;

    // Switch baseado no separador ativo
    switch (activeTab) {
      case "energy":
        // Configuração para o contexto de Consumo Energético
        return {
          title: "Consumo Energético Total",                    // Título do resultado
          value: result.value.toFixed(2),                       // Valor formatado com 2 casas decimais
          unit: "Wh",                                           // Unidade: Watt-hora
          secondary: `${(result.value / 1000).toFixed(4)} kWh`, // Conversão para kilowatt-hora
          interpretation: `A área sob a curva de potência P(t) no intervalo de tempo representa a energia total consumida. Foram consumidos ${result.value.toFixed(2)} Watt-hora, o equivalente a aproximadamente ${(result.value / 1000).toFixed(4)} quilowatt-hora.`,
          icon: "energy" as const,                               // Ícone a usar
          chartColor: "hsl(var(--chart-2))",                    // Cor esmeralda para o gráfico
          yLabel: "P(t) [Watts]",                               // Etiqueta do eixo Y: Potência em Watts
        };
      case "network":
        // Configuração para o contexto de Transferência de Dados
        return {
          title: "Transferência de Dados",                      // Título do resultado
          value: result.value.toFixed(2),                       // Valor formatado
          unit: "Mb",                                           // Unidade: Megabits
          secondary: `${(result.value / 8).toFixed(2)} MB`,    // Conversão para Megabytes (1 byte = 8 bits)
          interpretation: `A integração da taxa de transferência R(t) fornece o volume total de dados. Neste período, foram transferidos ${result.value.toFixed(2)} Megabits, correspondendo a ${(result.value / 8).toFixed(2)} Megabytes.`,
          icon: "network" as const,                             // Ícone de rede
          chartColor: "hsl(var(--chart-1))",                    // Cor azul para o gráfico
          yLabel: "R(t) [Mb/s]",                                // Etiqueta: Taxa de transferência em Mb/s
        };
      case "cpu":
        // Configuração para o contexto de Carga Computacional
        return {
          title: "Carga Computacional Acumulada",              // Título do resultado
          value: result.value.toFixed(2),                       // Valor formatado
          unit: "unidades de carga",                            // Unidade genérica
          secondary: undefined,                                 // Sem conversão secundária
          interpretation: `Este valor (${result.value.toFixed(2)}) representa a carga total de processamento acumulada ao longo do tempo. É útil para dimensionar a capacidade de arrefecimento e prever a vida útil dos componentes sob stress contínuo.`,
          icon: "cpu" as const,                                 // Ícone de CPU
          chartColor: "hsl(var(--chart-3))",                    // Cor roxa para o gráfico
          yLabel: "CPU(t) [%]",                                 // Etiqueta: Utilização da CPU em percentagem
        };
      default:
        // Caso padrão: retorna null se o separador não for reconhecido
        return null;
    }
  };

  // Obtém a configuração de exibição para o separador ativo
  const resultConfig = getTabConfig();
  
  // Obtém as estatísticas do histórico de cálculos
  const stats = getStatistics();

  // Retorna o JSX (estrutura HTML) do componente
  return (
    // Container principal com altura mínima de tela e padding inferior
    <div className="min-h-screen bg-background pb-12">
      {/* Cabeçalho fixo no topo da página */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        {/* Container com largura máxima e centralização */}
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Seção esquerda: Logo e título */}
          <div className="flex items-center gap-3">
            {/* Container do ícone com fundo colorido */}
            <div className="bg-primary/10 p-2 rounded-lg">
              {/* Ícone de graduação */}
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            {/* Texto do cabeçalho */}
            <div>
              {/* Título principal */}
              <h1 className="text-xl font-bold text-foreground tracking-tight">Análise Matemática I</h1>
              {/* Subtítulo */}
              <p className="text-xs text-muted-foreground font-medium">Engenharia Informática - ISPGaya</p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal da página */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Seção de introdução/título */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          {/* Título principal do simulador */}
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Simulador de Integrais</h2>
          {/* Descrição do projeto */}
          <p className="text-muted-foreground">
            Explore como o cálculo integral é utilizado para resolver problemas reais de engenharia,
            desde o consumo de energia até à análise de tráfego de rede.
          </p>
        </div>

        {/* Seção de estatísticas e histórico */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card de estatísticas */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              {/* Lado esquerdo: Total de cálculos */}
              <div>
                {/* Título do card */}
                <h3 className="font-semibold text-sm text-muted-foreground">Total de Cálculos</h3>
                {/* Número total (grande e em negrito) */}
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              {/* Lado direito: Distribuição por tipo */}
              <div className="text-right">
                {/* Número de cálculos de energia */}
                <p className="text-xs text-muted-foreground">Energia: {stats.byType.energy}</p>
                {/* Número de cálculos de rede */}
                <p className="text-xs text-muted-foreground">Rede: {stats.byType.network}</p>
                {/* Número de cálculos de CPU */}
                <p className="text-xs text-muted-foreground">CPU: {stats.byType.cpu}</p>
              </div>
            </div>
          </Card>
          
          {/* Card de histórico */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              {/* Lado esquerdo: Título e ícone */}
              <div className="flex items-center gap-2">
                {/* Ícone de histórico */}
                <History className="w-5 h-5 text-primary" />
                {/* Título */}
                <h3 className="font-semibold">Histórico</h3>
              </div>
              {/* Lado direito: Botões de ação */}
              <div className="flex gap-2">
                {/* Botão para mostrar/ocultar histórico */}
                <button
                  onClick={() => setShowHistory(!showHistory)} // Alterna o estado showHistory
                  className="text-sm text-primary hover:underline"
                >
                  {/* Mostra "Ocultar" se o histórico estiver visível, "Mostrar" caso contrário */}
                  {showHistory ? "Ocultar" : "Mostrar"}
                </button>
                {/* Botão para limpar histórico (só aparece se houver histórico) */}
                {history.length > 0 && (
                  <button
                    onClick={clearHistory} // Chama a função para limpar o histórico
                    className="text-sm text-destructive hover:underline"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Seção de histórico (só aparece se showHistory for true e houver histórico) */}
        {showHistory && history.length > 0 && (
          <div className="mb-8">
            {/* Card do histórico */}
            <Card className="p-4">
              {/* Título do histórico */}
              <h3 className="font-semibold mb-4">Últimos Cálculos</h3>
              {/* Lista de cálculos com scroll se necessário */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {/* Mapeia os primeiros 10 cálculos do histórico */}
                {history.slice(0, 10).map((item) => (
                  // Item individual do histórico
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                    {/* Lado esquerdo: Expressão e intervalo */}
                    <div>
                      {/* Expressão matemática em fonte monoespaçada */}
                      <span className="font-mono">{item.functionExpression}</span>
                      {/* Intervalo [t1, t2] */}
                      <span className="text-muted-foreground ml-2">
                        [{item.t1}, {item.t2}]
                      </span>
                    </div>
                    {/* Lado direito: Resultado */}
                    <div className="font-semibold">{item.result.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Sistema de separadores (tabs) para os três contextos */}
        <Tabs defaultValue="energy" value={activeTab} onValueChange={onTabChange} className="w-full">
          {/* Lista de separadores (botões) */}
          <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted/50 rounded-xl mb-8">
            {/* Separador: Consumo Energético */}
            <TabsTrigger 
              value="energy" 
              className="rounded-lg h-full data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all"
            >
              {/* Ícone de raio/energia */}
              <Zap className="w-4 h-4 mr-2" />
              {/* Texto do separador */}
              Consumo Energético
            </TabsTrigger>
            
            {/* Separador: Dados de Rede */}
            <TabsTrigger 
              value="network" 
              className="rounded-lg h-full data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
            >
              {/* Ícone de rede */}
              <Network className="w-4 h-4 mr-2" />
              {/* Texto do separador */}
              Dados de Rede
            </TabsTrigger>
            
            {/* Separador: Carga do Servidor */}
            <TabsTrigger 
              value="cpu" 
              className="rounded-lg h-full data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all"
            >
              {/* Ícone de CPU */}
              <Cpu className="w-4 h-4 mr-2" />
              {/* Texto do separador */}
              Carga do Servidor
            </TabsTrigger>
          </TabsList>

          {/* Grid de duas colunas: formulário à esquerda, resultados à direita */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Coluna esquerda: Formulário de entrada (4 colunas de 12) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Conteúdo do separador: Consumo Energético */}
              <TabsContent value="energy" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-300">
                {/* Card com a fórmula matemática */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                  {/* Fórmula: E = ∫ P(t) dt de t1 a t2 */}
                  <h3 className="font-serif italic text-emerald-900 text-lg text-center">
                    E = <span className="text-2xl">∫</span>
                    <sub className="text-xs">t₁</sub>
                    <sup className="text-xs">t₂</sup>
                    {" "}P(t) dt
                  </h3>
                  {/* Explicação da fórmula */}
                  <p className="text-xs text-center text-emerald-700/80 mt-2">
                    O consumo de energia é o integral da potência no tempo.
                  </p>
                </div>
                {/* Formulário de cálculo para energia */}
                <CalculationForm 
                  defaultExpression="100 + 20*t"  // Expressão padrão
                  variableName="P(t)"             // Nome da variável (Potência)
                  onCalculate={handleCalculate}  // Handler quando submete o formulário
                  isCalculating={isCalculating}   // Estado de loading
                />
              </TabsContent>

              {/* Conteúdo do separador: Dados de Rede */}
              <TabsContent value="network" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-300">
                {/* Card com a fórmula matemática */}
                 <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                  {/* Fórmula: D = ∫ R(t) dt de t1 a t2 */}
                  <h3 className="font-serif italic text-blue-900 text-lg text-center">
                    D = <span className="text-2xl">∫</span>
                    <sub className="text-xs">t₁</sub>
                    <sup className="text-xs">t₂</sup>
                    {" "}R(t) dt
                  </h3>
                  {/* Explicação da fórmula */}
                  <p className="text-xs text-center text-blue-700/80 mt-2">
                    O volume de dados é o integral da taxa de transferência.
                  </p>
                </div>
                {/* Formulário de cálculo para rede */}
                <CalculationForm 
                  defaultExpression="50 + 10*sin(t)" // Expressão padrão com função seno
                  variableName="R(t)"                 // Nome da variável (Taxa de transferência)
                  onCalculate={handleCalculate}       // Handler
                  isCalculating={isCalculating}        // Estado de loading
                />
              </TabsContent>

              {/* Conteúdo do separador: Carga do Servidor */}
              <TabsContent value="cpu" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-300">
                {/* Card com a fórmula matemática */}
                 <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
                  {/* Fórmula: C = ∫ CPU(t) dt de t1 a t2 */}
                  <h3 className="font-serif italic text-purple-900 text-lg text-center">
                    C = <span className="text-2xl">∫</span>
                    <sub className="text-xs">t₁</sub>
                    <sup className="text-xs">t₂</sup>
                    {" "}CPU(t) dt
                  </h3>
                  {/* Explicação da fórmula */}
                  <p className="text-xs text-center text-purple-700/80 mt-2">
                    A carga total é o integral da utilização da CPU.
                  </p>
                </div>
                {/* Formulário de cálculo para CPU */}
                <CalculationForm 
                  defaultExpression="30 + 40*t/(t+10)" // Expressão padrão mais complexa
                  variableName="CPU(t)"                 // Nome da variável (Utilização da CPU)
                  onCalculate={handleCalculate}         // Handler
                  isCalculating={isCalculating}          // Estado de loading
                />
              </TabsContent>
            </div>

            {/* Coluna direita: Resultados e Gráficos (8 colunas de 12) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Se houver resultado e configuração, mostra os resultados */}
              {result && resultConfig ? (
                <>
                  {/* Card com o resultado do cálculo */}
                  <MathResultCard 
                    title={resultConfig.title}                    // Título do resultado
                    value={resultConfig.value}                    // Valor formatado
                    unit={resultConfig.unit}                       // Unidade de medida
                    interpretation={resultConfig.interpretation}  // Interpretação física
                    icon={resultConfig.icon}                      // Ícone a usar
                    secondaryValue={resultConfig.secondary}        // Valor secundário (conversão)
                    estimatedError={result?.estimatedError}        // Erro estimado
                    steps={result?.steps}                         // Número de subintervalos
                  />
                  
                  {/* Container do gráfico */}
                  <div className="bg-white rounded-xl border border-border shadow-sm p-1">
                    {/* Componente do gráfico */}
                    <FunctionChart 
                      data={result.points}           // Array de pontos (t, y) para desenhar
                      color={resultConfig.chartColor} // Cor do gráfico (baseada no contexto)
                      yLabel={resultConfig.yLabel}     // Etiqueta do eixo Y
                    />
                  </div>
                </>
              ) : (
                // Se não houver resultado, mostra mensagem de estado vazio
                <div className="h-full flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border/60 rounded-xl bg-muted/5 text-muted-foreground p-8 text-center">
                  {/* Ícone de calculadora (grande e com opacidade reduzida) */}
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Calculator className="w-8 h-8 opacity-50" />
                  </div>
                  {/* Título da mensagem */}
                  <h3 className="text-lg font-medium mb-2">Aguardando Cálculo</h3>
                  {/* Instruções para o utilizador */}
                  <p className="max-w-xs text-sm">
                    Configure os parâmetros à esquerda e clique em "Calcular Integral" para visualizar os resultados e gráficos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </main>

      {/* Rodapé da página */}
      <footer className="py-8 border-t border-border mt-8 bg-muted/30">
        {/* Container centralizado */}
        <div className="container max-w-6xl mx-auto px-4 text-center">
          {/* Texto principal do rodapé */}
          <p className="text-sm text-muted-foreground font-medium">
            Projeto desenvolvido para a unidade curricular de Análise Matemática I.
          </p>
          {/* Copyright com ano dinâmico */}
          <p className="text-xs text-muted-foreground/60 mt-1">
            © {new Date().getFullYear()} Engenharia Informática - ISPGaya
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
