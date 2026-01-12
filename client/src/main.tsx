/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro é o ponto de entrada da aplicação React.
 * É o primeiro código JavaScript que executa quando a página carrega.
 * Monta o componente App no elemento root do HTML.
 */

// Importa a função createRoot do React DOM
// createRoot é a API moderna do React 18+ para renderizar componentes
import { createRoot } from "react-dom/client";

// Importa o componente principal da aplicação
import App from "./App";

// Importa os estilos CSS globais
// Este ficheiro contém Tailwind CSS e estilos personalizados
import "./index.css";

// Cria a raiz React no elemento com id "root" do HTML
// O "!" (non-null assertion) garante que o elemento existe
// Monta o componente App na raiz
createRoot(document.getElementById("root")!).render(<App />);

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
