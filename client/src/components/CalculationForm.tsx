import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Calculator, Info, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Define schema locally to match shared schema but with Zod specific validation messages
const formSchema = z.object({
  functionExpression: z.string().min(1, "Insira uma expressão matemática"),
  t1: z.coerce.number().min(0, "Tempo inicial deve ser positivo"),
  t2: z.coerce.number().min(0, "Tempo final deve ser positivo"),
  useAdaptive: z.boolean().default(false),
  steps: z.coerce.number().int().min(100).max(10000).default(1000),
}).refine(data => data.t2 > data.t1, {
  message: "O tempo final deve ser maior que o inicial",
  path: ["t2"],
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationFormProps {
  defaultExpression: string;
  variableName: string; // 'P(t)', 'R(t)', or 'CPU(t)'
  onCalculate: (values: FormValues) => Promise<void>;
  isCalculating: boolean;
}

export function CalculationForm({ 
  defaultExpression, 
  variableName, 
  onCalculate, 
  isCalculating 
}: CalculationFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      functionExpression: defaultExpression,
      t1: 0,
      t2: 10,
      useAdaptive: false,
      steps: 1000,
    },
  });

  return (
    <Card className="p-6 border-border shadow-sm h-full flex flex-col justify-center">
      <div className="mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Parâmetros do Modelo
        </h3>
        <p className="text-sm text-muted-foreground">Defina a função e o intervalo de tempo.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-6">
          <FormField
            control={form.control}
            name="functionExpression"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">Função {variableName}</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Exemplos: 100 + 20*t, 5*sin(t), t^2 + 10</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input 
                    placeholder="ex: 100 + 20*t" 
                    {...field} 
                    className="font-mono bg-muted/30" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="t1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Início (t1)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} className="bg-muted/30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="t2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fim (t2)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} className="bg-muted/30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-2 border-t">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              Opções Avançadas
            </Button>
            
            {showAdvanced && (
              <div className="mt-4 space-y-4 p-4 bg-muted/30 rounded-lg">
                <FormField
                  control={form.control}
                  name="useAdaptive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Método Adaptativo</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Refina automaticamente em áreas de maior variação
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {!form.watch("useAdaptive") && (
                  <FormField
                    control={form.control}
                    name="steps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subintervalos ({field.value})</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={100} 
                            max={10000} 
                            step={100}
                            {...field}
                            className="bg-muted/30"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Mais subintervalos = maior precisão (mais lento)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculando Integral...
              </>
            ) : (
              "Calcular Integral Definido"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
