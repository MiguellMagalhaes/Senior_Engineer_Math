/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o componente CalculationForm.
 * Implementa o formulário de entrada para os parâmetros do cálculo do integral:
 * - Expressão matemática da função
 * - Tempo inicial (t1) e final (t2)
 * - Opções avançadas (método adaptativo, número de subintervalos)
 * Utiliza React Hook Form para gestão de formulários e Zod para validação.
 */

// Importa o hook useState do React para gerir estado local
import { useState } from "react";

// Importa React Hook Form para gestão eficiente de formulários
// useForm: hook principal para criar e gerir formulários
import { useForm } from "react-hook-form";

// Importa zodResolver para integrar validação Zod com React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";

// Importa z (Zod) para criar esquemas de validação
import { z } from "zod";

// Importa ícones da biblioteca lucide-react
// Loader2: ícone de loading (spinner), Calculator: ícone de calculadora
// Info: ícone de informação, Settings: ícone de configurações
import { Loader2, Calculator, Info, Settings } from "lucide-react";

// Importa componentes de UI
import { Input } from "@/components/ui/input";           // Campo de entrada de texto
import { Button } from "@/components/ui/button";         // Botão
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Componentes de formulário
import { Card } from "@/components/ui/card";             // Card para container
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Tooltip para ajuda
import { Switch } from "@/components/ui/switch";         // Switch (interruptor) para opções booleanas
import { Label } from "@/components/ui/label";           // Etiqueta de formulário

/**
 * Define o esquema de validação usando Zod
 * Este esquema valida todos os campos do formulário antes de submeter
 */
const formSchema = z.object({
  // Expressão matemática: string obrigatória (mínimo 1 caractere)
  functionExpression: z.string().min(1, "Insira uma expressão matemática"),
  
  // Tempo inicial: número obrigatório, mínimo 0 (não pode ser negativo)
  t1: z.coerce.number().min(0, "Tempo inicial deve ser positivo"),
  
  // Tempo final: número obrigatório, mínimo 0
  t2: z.coerce.number().min(0, "Tempo final deve ser positivo"),
  
  // Método adaptativo: boolean, padrão false
  useAdaptive: z.boolean().default(false),
  
  // Número de subintervalos: número inteiro entre 100 e 10000, padrão 1000
  steps: z.coerce.number().int().min(100).max(10000).default(1000),
}).refine(data => data.t2 > data.t1, {
  // Validação adicional: t2 deve ser maior que t1
  message: "O tempo final deve ser maior que o inicial",
  path: ["t2"], // O erro aparece no campo t2
});

/**
 * Tipo TypeScript inferido do esquema Zod
 * Representa os valores válidos do formulário
 */
type FormValues = z.infer<typeof formSchema>;

/**
 * Interface que define as props do componente CalculationForm
 */
interface CalculationFormProps {
  defaultExpression: string;  // Expressão matemática padrão (ex: "100 + 20*t")
  variableName: string;       // Nome da variável a mostrar (ex: "P(t)", "R(t)", "CPU(t)")
  onCalculate: (values: FormValues) => Promise<void>; // Função chamada quando o formulário é submetido
  isCalculating: boolean;     // Indica se um cálculo está em progresso (para desabilitar botão)
}

/**
 * Componente CalculationForm
 * Renderiza o formulário completo para entrada de parâmetros do cálculo
 */
export function CalculationForm({ 
  defaultExpression,  // Expressão padrão recebida como prop
  variableName,      // Nome da variável recebido como prop
  onCalculate,       // Handler de cálculo recebido como prop
  isCalculating      // Estado de loading recebido como prop
}: CalculationFormProps) {
  // Estado para controlar se as opções avançadas estão visíveis
  // true: opções avançadas visíveis, false: ocultas
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Inicializa o React Hook Form com validação Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // Integra validação Zod
    defaultValues: {
      functionExpression: defaultExpression, // Expressão padrão
      t1: 0,                                // Tempo inicial padrão: 0
      t2: 10,                               // Tempo final padrão: 10
      useAdaptive: false,                   // Método adaptativo desativado por padrão
      steps: 1000,                          // 1000 subintervalos por padrão
    },
  });

  // Retorna o JSX do formulário
  return (
    // Card que contém todo o formulário
    <Card className="p-6 border-border shadow-sm h-full flex flex-col justify-center">
      {/* Cabeçalho do formulário */}
      <div className="mb-6">
        {/* Título com ícone */}
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {/* Ícone de calculadora */}
          <Calculator className="w-5 h-5 text-primary" />
          {/* Texto do título */}
          Parâmetros do Modelo
        </h3>
        {/* Descrição */}
        <p className="text-sm text-muted-foreground">Defina a função e o intervalo de tempo.</p>
      </div>

      {/* Formulário React Hook Form */}
      <Form {...form}>
        {/* Formulário HTML nativo */}
        <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-6">
          {/* Campo: Expressão Matemática */}
          <FormField
            control={form.control}              // Control do React Hook Form
            name="functionExpression"            // Nome do campo
            render={({ field }) => (
              <FormItem>
                {/* Etiqueta e ícone de ajuda */}
                <div className="flex items-center justify-between">
                  {/* Etiqueta do campo */}
                  <FormLabel className="text-sm font-medium">Função {variableName}</FormLabel>
                  {/* Tooltip com exemplos */}
                  <Tooltip>
                    {/* Trigger do tooltip (ícone de informação) */}
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    {/* Conteúdo do tooltip */}
                    <TooltipContent>
                      <p>Exemplos: 100 + 20*t, 5*sin(t), t^2 + 10</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {/* Campo de entrada */}
                <FormControl>
                  <Input 
                    placeholder="ex: 100 + 20*t"  // Texto de placeholder
                    {...field}                     // Spread das props do React Hook Form
                    className="font-mono bg-muted/30" // Fonte monoespaçada e fundo suave
                  />
                </FormControl>
                {/* Mensagem de erro (se houver) */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grid de dois campos lado a lado: t1 e t2 */}
          <div className="grid grid-cols-2 gap-4">
            {/* Campo: Tempo Inicial (t1) */}
            <FormField
              control={form.control}
              name="t1"
              render={({ field }) => (
                <FormItem>
                  {/* Etiqueta */}
                  <FormLabel>Início (t1)</FormLabel>
                  {/* Campo de entrada numérica */}
                  <FormControl>
                    <Input 
                      type="number"    // Tipo numérico
                      step="0.1"       // Incremento de 0.1
                      {...field}       // Props do React Hook Form
                      className="bg-muted/30" // Estilo
                    />
                  </FormControl>
                  {/* Mensagem de erro */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo: Tempo Final (t2) */}
            <FormField
              control={form.control}
              name="t2"
              render={({ field }) => (
                <FormItem>
                  {/* Etiqueta */}
                  <FormLabel>Fim (t2)</FormLabel>
                  {/* Campo de entrada numérica */}
                  <FormControl>
                    <Input 
                      type="number"    // Tipo numérico
                      step="0.1"       // Incremento de 0.1
                      {...field}       // Props do React Hook Form
                      className="bg-muted/30" // Estilo
                    />
                  </FormControl>
                  {/* Mensagem de erro */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Seção de opções avançadas */}
          <div className="pt-2 border-t">
            {/* Botão para mostrar/ocultar opções avançadas */}
            <Button
              type="button"           // Tipo button (não submete o formulário)
              variant="ghost"          // Variante ghost (transparente)
              size="sm"                // Tamanho pequeno
              onClick={() => setShowAdvanced(!showAdvanced)} // Alterna o estado
              className="w-full justify-start" // Largura total, alinhado à esquerda
            >
              {/* Ícone de configurações */}
              <Settings className="w-4 h-4 mr-2" />
              {/* Texto do botão */}
              Opções Avançadas
            </Button>
            
            {/* Se as opções avançadas estiverem visíveis, mostra os campos */}
            {showAdvanced && (
              <div className="mt-4 space-y-4 p-4 bg-muted/30 rounded-lg">
                {/* Campo: Método Adaptativo (Switch) */}
                <FormField
                  control={form.control}
                  name="useAdaptive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      {/* Lado esquerdo: Descrição */}
                      <div className="space-y-0.5">
                        {/* Etiqueta */}
                        <FormLabel>Método Adaptativo</FormLabel>
                        {/* Descrição explicativa */}
                        <p className="text-xs text-muted-foreground">
                          Refina automaticamente em áreas de maior variação
                        </p>
                      </div>
                      {/* Lado direito: Switch */}
                      <FormControl>
                        <Switch
                          checked={field.value}           // Valor atual (true/false)
                          onCheckedChange={field.onChange} // Handler quando muda
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* Campo: Número de Subintervalos (só aparece se método adaptativo estiver desativado) */}
                {!form.watch("useAdaptive") && (
                  <FormField
                    control={form.control}
                    name="steps"
                    render={({ field }) => (
                      <FormItem>
                        {/* Etiqueta com valor atual */}
                        <FormLabel>Subintervalos ({field.value})</FormLabel>
                        {/* Campo de entrada numérica */}
                        <FormControl>
                          <Input 
                            type="number"    // Tipo numérico
                            min={100}        // Valor mínimo
                            max={10000}      // Valor máximo
                            step={100}       // Incremento de 100
                            {...field}       // Props do React Hook Form
                            className="bg-muted/30" // Estilo
                          />
                        </FormControl>
                        {/* Descrição explicativa */}
                        <p className="text-xs text-muted-foreground">
                          Mais subintervalos = maior precisão (mais lento)
                        </p>
                        {/* Mensagem de erro */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </div>

          {/* Botão de submissão do formulário */}
          <Button 
            type="submit"              // Tipo submit (submete o formulário)
            className="w-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
            disabled={isCalculating}   // Desabilitado durante o cálculo
          >
            {/* Se estiver a calcular, mostra spinner e texto de loading */}
            {isCalculating ? (
              <>
                {/* Ícone de loading animado */}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {/* Texto de loading */}
                Calculando Integral...
              </>
            ) : (
              // Se não estiver a calcular, mostra texto normal
              "Calcular Integral Definido"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
