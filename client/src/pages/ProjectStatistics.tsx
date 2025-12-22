import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Calculator, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";

export default function ProjectStatistics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: [api.public.projectStatistics.path],
    queryFn: async () => {
      const res = await fetch(api.public.projectStatistics.path);
      if (!res.ok) throw new Error("Failed to fetch statistics");
      return api.public.projectStatistics.responses[200].parse(await res.json());
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-12">
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
          </div>
        </header>
        <main className="container max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-background pb-12">
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
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Estatísticas do Projeto</h2>
          <p className="text-muted-foreground">
            Visão geral de todos os utilizadores e cálculos do sistema
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Utilizadores</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Cálculos</p>
                <p className="text-2xl font-bold">{stats.totalCalculations}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média de Resultados</p>
                <p className="text-2xl font-bold">{stats.averageResult.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipos de Cálculo</p>
                <p className="text-2xl font-bold">
                  {stats.byType.energy + stats.byType.network + stats.byType.cpu}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Por Curso</h3>
            <div className="space-y-2">
              {Object.entries(stats.byCourse).length > 0 ? (
                Object.entries(stats.byCourse)
                  .sort(([, a], [, b]) => b - a)
                  .map(([course, count]) => (
                    <div key={course} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="font-medium">{course}</span>
                      <span className="text-primary font-bold">{count}</span>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Por Ano</h3>
            <div className="space-y-2">
              {Object.entries(stats.byYear).length > 0 ? (
                Object.entries(stats.byYear)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([year, count]) => (
                    <div key={year} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="font-medium">{year}º Ano</span>
                      <span className="text-primary font-bold">{count}</span>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Distribuição por Tipo</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Energia</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.byType.energy}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Rede</p>
              <p className="text-2xl font-bold text-blue-600">{stats.byType.network}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-muted-foreground">CPU</p>
              <p className="text-2xl font-bold text-purple-600">{stats.byType.cpu}</p>
            </div>
          </div>
        </Card>

        {stats.recentActivity.length > 0 && (
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Atividade Recente (Últimos 7 dias)</h3>
            <div className="space-y-2">
              {stats.recentActivity.map(({ date, count }) => (
                <div key={date} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">{new Date(date).toLocaleDateString('pt-PT')}</span>
                  <span className="font-bold">{count} cálculos</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

