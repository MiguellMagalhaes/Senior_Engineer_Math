/**
 * Trabalho realizado por Miguel Magalhães, aluno de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o componente NotFound (Página 404).
 * É exibido quando o utilizador acede a uma rota que não existe.
 * Inclui informações de debug em modo de desenvolvimento para ajudar a identificar problemas de roteamento.
 */

// Importa componentes de UI
import { Card, CardContent } from "@/components/ui/card";

// Importa ícone de alerta da biblioteca lucide-react
import { AlertCircle } from "lucide-react";

// Importa o hook useLocation do Wouter para obter a localização atual
import { useLocation } from "wouter";

/**
 * Componente NotFound
 * Renderiza a página de erro 404 quando uma rota não é encontrada
 */
export default function NotFound() {
  // Obtém a localização atual do router (caminho da URL)
  const [location] = useLocation();
  
  // Informações de debug (apenas em desenvolvimento)
  // Verifica se window está definido (não está em SSR)
  if (typeof window !== "undefined") {
    // Regista a localização atual no console
    console.log("NotFound - Current location:", location);
    // Regista o pathname completo da janela
    console.log("NotFound - Window pathname:", window.location.pathname);
    // Regista o BASE_URL configurado no Vite
    console.log("NotFound - BASE_URL:", import.meta.env.BASE_URL);
  }
  
  // Retorna o JSX da página 404
  return (
    // Container principal: altura mínima de tela, largura total, centralizado vertical e horizontalmente
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      {/* Card que contém a mensagem de erro */}
      <Card className="w-full max-w-md mx-4">
        {/* Conteúdo do card com padding superior */}
        <CardContent className="pt-6">
          {/* Cabeçalho: ícone e título */}
          <div className="flex mb-4 gap-2">
            {/* Ícone de alerta (círculo com exclamação) em vermelho */}
            <AlertCircle className="h-8 w-8 text-red-500" />
            {/* Título da página de erro */}
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          {/* Mensagem explicativa */}
          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
          
          {/* Informações de debug (apenas em modo de desenvolvimento) */}
          {import.meta.env.DEV && (
            // Container com informações técnicas
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs font-mono">
              {/* Localização atual do router */}
              <div>Location: {location}</div>
              {/* Pathname completo da janela (se disponível) */}
              <div>Pathname: {typeof window !== "undefined" ? window.location.pathname : "N/A"}</div>
              {/* BASE_URL configurado (caminho base da aplicação) */}
              <div>BASE_URL: {import.meta.env.BASE_URL || "/"}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Trabalho realizado por Miguel Magalhães, aluno de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
