import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CalculationInput } from "@shared/routes";
import { z } from "zod";

// Hook to fetch calculation history
export function useCalculations() {
  return useQuery({
    queryKey: [api.calculations.list.path],
    queryFn: async () => {
      const res = await fetch(api.calculations.list.path);
      if (!res.ok) throw new Error("Failed to fetch calculation history");
      return api.calculations.list.responses[200].parse(await res.json());
    },
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
    },
  });
}
