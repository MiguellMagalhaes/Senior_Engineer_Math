import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCreateCalculation } from "@/hooks/use-calculations";
import { calculateIntegral, type IntegrationResult } from "@/lib/math-utils";
import { CalculationForm } from "@/components/CalculationForm";
import { FunctionChart } from "@/components/FunctionChart";
import { MathResultCard } from "@/components/MathResultCard";
import { Zap, Network, Cpu, GraduationCap, Calculator } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const createCalculation = useCreateCalculation();

  // State for calculation results
  const [result, setResult] = useState<IntegrationResult | null>(null);
  const [activeTab, setActiveTab] = useState("energy");
  const [isCalculating, setIsCalculating] = useState(false);

  // Handlers for calculation
  const handleCalculate = async (values: any) => {
    setIsCalculating(true);
    setResult(null); // Reset previous result

    try {
      // 1. Perform client-side math calculation
      const calcResult = calculateIntegral(values.functionExpression, values.t1, values.t2);
      
      // Simulate a small delay for better UX (so user sees the loading state)
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setResult(calcResult);

      // 2. Persist to backend
      createCalculation.mutate({
        type: activeTab,
        functionExpression: values.functionExpression,
        t1: values.t1,
        t2: values.t2,
        result: calcResult.value,
      });

      toast({
        title: "Cálculo realizado com sucesso!",
        description: `Integral calculado no intervalo [${values.t1}, ${values.t2}].`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no cálculo",
        description: error.message,
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const onTabChange = (value: string) => {
    setActiveTab(value);
    setResult(null); // Clear results on tab switch
  };

  // Derived display values based on active tab
  const getTabConfig = () => {
    if (!result) return null;

    switch (activeTab) {
      case "energy":
        return {
          title: "Consumo Energético Total",
          value: result.value.toFixed(2),
          unit: "Wh",
          secondary: `${(result.value / 1000).toFixed(4)} kWh`,
          interpretation: `A área sob a curva de potência P(t) no intervalo de tempo representa a energia total consumida. Foram consumidos ${result.value.toFixed(2)} Watt-hora, o equivalente a aproximadamente ${(result.value / 1000).toFixed(4)} quilowatt-hora.`,
          icon: "energy" as const,
          chartColor: "hsl(var(--chart-2))", // Emerald
          yLabel: "P(t) [Watts]",
        };
      case "network":
        return {
          title: "Transferência de Dados",
          value: result.value.toFixed(2),
          unit: "Mb",
          secondary: `${(result.value / 8).toFixed(2)} MB`,
          interpretation: `A integração da taxa de transferência R(t) fornece o volume total de dados. Neste período, foram transferidos ${result.value.toFixed(2)} Megabits, correspondendo a ${(result.value / 8).toFixed(2)} Megabytes.`,
          icon: "network" as const,
          chartColor: "hsl(var(--chart-1))", // Blue
          yLabel: "R(t) [Mb/s]",
        };
      case "cpu":
        return {
          title: "Carga Computacional Acumulada",
          value: result.value.toFixed(2),
          unit: "unidades de carga",
          secondary: undefined,
          interpretation: `Este valor (${result.value.toFixed(2)}) representa a carga total de processamento acumulada ao longo do tempo. É útil para dimensionar a capacidade de arrefecimento e prever a vida útil dos componentes sob stress contínuo.`,
          icon: "cpu" as const,
          chartColor: "hsl(var(--chart-3))", // Purple
          yLabel: "CPU(t) [%]",
        };
      default:
        return null;
    }
  };

  const resultConfig = getTabConfig();

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Análise Matemática I</h1>
              <p className="text-xs text-muted-foreground font-medium">Engenharia Informática - ISPGaya</p>
            </div>
          </div>
          <div className="hidden md:block text-xs font-mono bg-muted px-3 py-1 rounded-full text-muted-foreground">
            Aplicações do Cálculo Integral
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Simulador de Integrais</h2>
          <p className="text-muted-foreground">
            Explore como o cálculo integral é utilizado para resolver problemas reais de engenharia,
            desde o consumo de energia até à análise de tráfego de rede.
          </p>
        </div>

        <Tabs defaultValue="energy" value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted/50 rounded-xl mb-8">
            <TabsTrigger 
              value="energy" 
              className="rounded-lg h-full data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all"
            >
              <Zap className="w-4 h-4 mr-2" />
              Consumo Energético
            </TabsTrigger>
            <TabsTrigger 
              value="network" 
              className="rounded-lg h-full data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
            >
              <Network className="w-4 h-4 mr-2" />
              Dados de Rede
            </TabsTrigger>
            <TabsTrigger 
              value="cpu" 
              className="rounded-lg h-full data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all"
            >
              <Cpu className="w-4 h-4 mr-2" />
              Carga do Servidor
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column: Input Form */}
            <div className="lg:col-span-4 space-y-6">
              <TabsContent value="energy" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-300">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                  <h3 className="font-serif italic text-emerald-900 text-lg text-center">
                    E = <span className="text-2xl">∫</span>
                    <sub className="text-xs">t₁</sub>
                    <sup className="text-xs">t₂</sup>
                    {" "}P(t) dt
                  </h3>
                  <p className="text-xs text-center text-emerald-700/80 mt-2">
                    O consumo de energia é o integral da potência no tempo.
                  </p>
                </div>
                <CalculationForm 
                  defaultExpression="100 + 20*t" 
                  variableName="P(t)"
                  onCalculate={handleCalculate}
                  isCalculating={isCalculating}
                />
              </TabsContent>

              <TabsContent value="network" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-300">
                 <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                  <h3 className="font-serif italic text-blue-900 text-lg text-center">
                    D = <span className="text-2xl">∫</span>
                    <sub className="text-xs">t₁</sub>
                    <sup className="text-xs">t₂</sup>
                    {" "}R(t) dt
                  </h3>
                  <p className="text-xs text-center text-blue-700/80 mt-2">
                    O volume de dados é o integral da taxa de transferência.
                  </p>
                </div>
                <CalculationForm 
                  defaultExpression="50 + 10*sin(t)" 
                  variableName="R(t)"
                  onCalculate={handleCalculate}
                  isCalculating={isCalculating}
                />
              </TabsContent>

              <TabsContent value="cpu" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-300">
                 <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
                  <h3 className="font-serif italic text-purple-900 text-lg text-center">
                    C = <span className="text-2xl">∫</span>
                    <sub className="text-xs">t₁</sub>
                    <sup className="text-xs">t₂</sup>
                    {" "}CPU(t) dt
                  </h3>
                  <p className="text-xs text-center text-purple-700/80 mt-2">
                    A carga total é o integral da utilização da CPU.
                  </p>
                </div>
                <CalculationForm 
                  defaultExpression="30 + 40*t/(t+10)" 
                  variableName="CPU(t)"
                  onCalculate={handleCalculate}
                  isCalculating={isCalculating}
                />
              </TabsContent>
            </div>

            {/* Right Column: Results & Charts */}
            <div className="lg:col-span-8 space-y-6">
              {result && resultConfig ? (
                <>
                  <MathResultCard 
                    title={resultConfig.title}
                    value={resultConfig.value}
                    unit={resultConfig.unit}
                    interpretation={resultConfig.interpretation}
                    icon={resultConfig.icon}
                    secondaryValue={resultConfig.secondary}
                  />
                  
                  <div className="bg-white rounded-xl border border-border shadow-sm p-1">
                    <FunctionChart 
                      data={result.points} 
                      color={resultConfig.chartColor}
                      yLabel={resultConfig.yLabel}
                    />
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border/60 rounded-xl bg-muted/5 text-muted-foreground p-8 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Calculator className="w-8 h-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Aguadando Cálculo</h3>
                  <p className="max-w-xs text-sm">
                    Configure os parâmetros à esquerda e clique em "Calcular Integral" para visualizar os resultados e gráficos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </main>

      <footer className="py-8 border-t border-border mt-8 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Projeto desenvolvido para a unidade curricular de Análise Matemática I.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            © {new Date().getFullYear()} Engenharia Informática - ISPGaya
          </p>
        </div>
      </footer>
    </div>
  );
}
