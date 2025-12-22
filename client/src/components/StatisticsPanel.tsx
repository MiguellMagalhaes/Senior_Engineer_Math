import { useStatistics } from "@/hooks/use-calculations";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Minus, Maximize, Zap, Network, Cpu } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatisticsPanel() {
  const { data: stats, isLoading } = useStatistics();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Estatísticas</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Média</div>
          <div className="text-2xl font-bold">{stats.averageResult.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Mínimo</div>
          <div className="text-2xl font-bold">{stats.minResult.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Máximo</div>
          <div className="text-2xl font-bold">{stats.maxResult.toFixed(2)}</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Por Tipo</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium">Energia</span>
            </div>
            <span className="font-semibold">{stats.byType.energy}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Rede</span>
            </div>
            <span className="font-semibold">{stats.byType.network}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">CPU</span>
            </div>
            <span className="font-semibold">{stats.byType.cpu}</span>
          </div>
        </div>
      </div>

      {stats.dateRange.earliest && stats.dateRange.latest && (
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          Período: {new Date(stats.dateRange.earliest).toLocaleDateString()} - {new Date(stats.dateRange.latest).toLocaleDateString()}
        </div>
      )}
    </Card>
  );
}

