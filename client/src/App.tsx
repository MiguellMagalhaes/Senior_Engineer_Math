import { Switch, Route, Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

// Get base path from Vite (set during build)
// This is "/" in development and "/Senior_Engineer_Math/" in production
const base = import.meta.env.BASE_URL || "/";

// Debug: log base path in development
if (import.meta.env.DEV) {
  console.log("Base URL:", base);
  console.log("Current pathname:", window.location.pathname);
}

function AppRouter() {
  return (
    <Router base={base}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
