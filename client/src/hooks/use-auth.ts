import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { users } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, {
        credentials: "include",
      });
      if (res.status === 401) {
        return null;
      }
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.me.responses[200].parse(await res.json()) as typeof users.$inferSelect;
    },
    retry: false,
  });

  const logout = async () => {
    await fetch(api.auth.logout.path, {
      method: "POST",
      credentials: "include",
    });
    refetch();
    window.location.href = "/auth";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refetch,
  };
}

