import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface FunctionChartProps {
  data: Array<{ t: number; y: number }>;
  color?: string;
  yLabel?: string;
  xLabel?: string;
  isLoading?: boolean;
}

export function FunctionChart({ 
  data, 
  color = "hsl(var(--primary))", 
  yLabel = "f(t)",
  xLabel = "t (tempo)",
  isLoading = false
}: FunctionChartProps) {
  
  if (isLoading) {
    return (
      <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-xl border border-border/50 flex items-center justify-center">
        <span className="text-muted-foreground">Calculando gráfico...</span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-[300px] w-full bg-muted/10 rounded-xl border border-border/50 flex items-center justify-center border-dashed">
        <span className="text-muted-foreground text-sm">Insira os dados para visualizar o gráfico</span>
      </div>
    );
  }

  return (
    <Card className="p-6 border-border shadow-sm bg-card/50 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Representação Gráfica</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
          {yLabel} vs {xLabel}
        </div>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="t" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `t=${val}`}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => typeof val === 'number' ? val.toFixed(1) : val}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow-md)",
              }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
              labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.25rem" }}
              formatter={(value: number) => [value.toFixed(4), yLabel]}
              labelFormatter={(label) => `${xLabel}: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="y"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorY)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
