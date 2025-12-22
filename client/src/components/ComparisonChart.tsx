import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";

export interface ComparisonSeries {
  name: string;
  data: Array<{ t: number; y: number }>;
  color: string;
}

interface ComparisonChartProps {
  series: ComparisonSeries[];
  yLabel?: string;
  xLabel?: string;
}

export function ComparisonChart({ 
  series,
  yLabel = "f(t)",
  xLabel = "t (tempo)",
}: ComparisonChartProps) {
  
  // Merge all series data by t value
  const mergedData = useMemo(() => {
    if (series.length === 0) return [];
    
    // Get all unique t values
    const allTValues = new Set<number>();
    series.forEach(s => {
      s.data.forEach(point => allTValues.add(point.t));
    });
    
    const sortedTValues = Array.from(allTValues).sort((a, b) => a - b);
    
    // Create merged data points
    return sortedTValues.map(t => {
      const point: Record<string, number> = { t };
      series.forEach((s, index) => {
        const dataPoint = s.data.find(p => Math.abs(p.t - t) < 0.01);
        point[`y${index}`] = dataPoint?.y ?? null;
      });
      return point;
    });
  }, [series]);

  if (series.length === 0) {
    return (
      <div className="h-[300px] w-full bg-muted/10 rounded-xl border border-border/50 flex items-center justify-center border-dashed">
        <span className="text-muted-foreground text-sm">Adicione funções para comparar</span>
      </div>
    );
  }

  return (
    <Card className="p-6 border-border shadow-sm bg-card/50 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Comparação de Funções</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {yLabel} vs {xLabel}
        </div>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mergedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {series.map((s, index) => (
                <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
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
              formatter={(value: number, name: string) => {
                const seriesIndex = parseInt(name.replace('y', ''));
                const seriesName = series[seriesIndex]?.name || '';
                return [value?.toFixed(4) ?? 'N/A', seriesName];
              }}
              labelFormatter={(label) => `${xLabel}: ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value, entry) => {
                const seriesIndex = parseInt(entry.dataKey?.replace('y', '') || '0');
                return series[seriesIndex]?.name || value;
              }}
            />
            {series.map((s, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={`y${index}`}
                stroke={s.color}
                strokeWidth={2}
                fillOpacity={0.3}
                fill={`url(#color${index})`}
                animationDuration={1000}
                name={s.name}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

