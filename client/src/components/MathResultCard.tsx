import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Activity, TrendingUp, Cpu } from "lucide-react";

interface MathResultCardProps {
  title: string;
  value: string;
  unit: string;
  interpretation: string;
  icon?: "energy" | "network" | "cpu";
  secondaryValue?: string;
  estimatedError?: number;
  steps?: number;
}

export function MathResultCard({ 
  title, 
  value, 
  unit, 
  interpretation, 
  icon = "activity",
  secondaryValue,
  estimatedError,
  steps
}: MathResultCardProps) {
  
  const getIcon = () => {
    switch (icon) {
      case "energy": return <TrendingUp className="w-5 h-5 text-amber-500" />;
      case "network": return <Activity className="w-5 h-5 text-blue-500" />;
      case "cpu": return <Cpu className="w-5 h-5 text-purple-500" />;
      default: return <Activity className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 overflow-hidden relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2 bg-primary/10 rounded-lg">
          {getIcon()}
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>

      <div className="mb-6 relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-primary font-mono">
            {value}
          </span>
          <span className="text-muted-foreground font-medium">{unit}</span>
        </div>
        {secondaryValue && (
          <div className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
            <ArrowRight className="w-3 h-3" />
            {secondaryValue}
          </div>
        )}
        {(estimatedError !== undefined || steps) && (
          <div className="mt-2 text-xs text-muted-foreground space-y-1">
            {steps && <div>Subintervalos: {steps}</div>}
            {estimatedError !== undefined && (
              <div>Erro estimado: {estimatedError.toExponential(2)}</div>
            )}
          </div>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg p-4 border border-border/50 relative z-10">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Interpretação Física
        </h4>
        <p className="text-sm text-foreground/80 leading-relaxed font-serif italic">
          "{interpretation}"
        </p>
      </div>
    </div>
  );
}
