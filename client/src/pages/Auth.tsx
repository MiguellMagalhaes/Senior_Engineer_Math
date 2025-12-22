import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { GraduationCap } from "lucide-react";

type AuthMode = "login" | "register" | "forgot-password";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Análise Matemática I</h1>
          <p className="text-muted-foreground mt-2">
            Engenharia Informática - ISPGaya
          </p>
        </div>

        {mode === "login" && (
          <LoginForm
            onSwitchToRegister={() => setMode("register")}
            onSwitchToForgotPassword={() => setMode("forgot-password")}
          />
        )}

        {mode === "register" && (
          <RegisterForm
            onSwitchToLogin={() => setMode("login")}
          />
        )}

        {mode === "forgot-password" && (
          <ForgotPasswordForm
            onBack={() => setMode("login")}
          />
        )}
      </div>
    </div>
  );
}

