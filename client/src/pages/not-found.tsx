import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [location] = useLocation();
  
  // Debug info
  if (typeof window !== "undefined") {
    console.log("NotFound - Current location:", location);
    console.log("NotFound - Window pathname:", window.location.pathname);
    console.log("NotFound - BASE_URL:", import.meta.env.BASE_URL);
  }
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
          
          {import.meta.env.DEV && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs font-mono">
              <div>Location: {location}</div>
              <div>Pathname: {typeof window !== "undefined" ? window.location.pathname : "N/A"}</div>
              <div>BASE_URL: {import.meta.env.BASE_URL || "/"}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
