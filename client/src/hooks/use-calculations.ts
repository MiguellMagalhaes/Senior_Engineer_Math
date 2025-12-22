import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type QueryParams, type Statistics } from "@shared/schema";
import { z } from "zod";

// Hook to fetch calculation history with pagination and filters
export function useCalculations(params?: QueryParams) {
  return useQuery({
    queryKey: [api.calculations.list.path, params],
    queryFn: async () => {
      const url = buildUrl(api.calculations.list.path, params as Record<string, string | number>);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch calculation history");
      return api.calculations.list.responses[200].parse(await res.json());
    },
  });
}

// Hook to fetch statistics
export function useStatistics() {
  return useQuery({
    queryKey: [api.calculations.statistics.path],
    queryFn: async () => {
      const res = await fetch(api.calculations.statistics.path);
      if (!res.ok) throw new Error("Failed to fetch statistics");
      return api.calculations.statistics.responses[200].parse(await res.json()) as Statistics;
    },
  });
}

// Hook to export calculations
export function useExportCalculations() {
  return useQuery({
    queryKey: [api.calculations.export.path],
    queryFn: async () => {
      const res = await fetch(api.calculations.export.path);
      if (!res.ok) throw new Error("Failed to export calculations");
      return api.calculations.export.responses[200].parse(await res.json());
    },
    enabled: false, // Only fetch when explicitly called
  });
}

// Hook to save a new calculation
export function useCreateCalculation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.calculations.create.input>) => {
      const res = await fetch(api.calculations.create.path, {
        method: api.calculations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Invalid input");
        }
        throw new Error("Failed to save calculation");
      }
      
      return api.calculations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.calculations.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.calculations.statistics.path] });
    },
  });
}
