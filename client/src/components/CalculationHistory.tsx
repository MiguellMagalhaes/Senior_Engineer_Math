import { useState } from "react";
import { useCalculations } from "@/hooks/use-calculations";
import { type QueryParams } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function CalculationHistory() {
  const [params, setParams] = useState<QueryParams>({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useCalculations(params);

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key: keyof QueryParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setParams({ page: 1, limit: 10 });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "energy": return "bg-emerald-100 text-emerald-800";
      case "network": return "bg-blue-100 text-blue-800";
      case "cpu": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Histórico de Cálculos</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select
              value={params.type || ""}
              onValueChange={(value) => handleFilterChange("type", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="energy">Energia</SelectItem>
                <SelectItem value="network">Rede</SelectItem>
                <SelectItem value="cpu">CPU</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Data inicial"
              value={params.dateFrom || ""}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)}
            />

            <Input
              type="date"
              placeholder="Data final"
              value={params.dateTo || ""}
              onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)}
            />

            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
      ) : !data?.data.length ? (
        <div className="text-center py-8 text-muted-foreground">Nenhum cálculo encontrado</div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {data.data.map((calc) => (
              <div
                key={calc.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getTypeColor(calc.type)}>
                      {calc.type}
                    </Badge>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {calc.functionExpression}
                    </code>
                    <span className="text-sm text-muted-foreground">
                      [{calc.t1}, {calc.t2}]
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{Number(calc.result).toFixed(2)}</div>
                    {calc.createdAt && (
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(calc.createdAt), "dd/MM/yyyy HH:mm")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.pagination && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Página {data.pagination.page} de {data.pagination.totalPages} 
                ({data.pagination.total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.pagination.page - 1)}
                  disabled={!data.pagination.hasPrev}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.pagination.page + 1)}
                  disabled={!data.pagination.hasNext}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

