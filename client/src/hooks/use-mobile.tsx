/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o hook useIsMobile.
 * Detecta se o dispositivo atual é um dispositivo móvel baseado na largura da janela.
 * Útil para ajustar a interface do utilizador em dispositivos móveis.
 */

// Importa React para usar hooks
import * as React from "react"

// Breakpoint em pixels que define o limite entre desktop e mobile
// Dispositivos com largura menor que 768px são considerados móveis
const MOBILE_BREAKPOINT = 768

/**
 * Hook que detecta se o dispositivo atual é um dispositivo móvel
 * Usa window.matchMedia para ouvir mudanças no tamanho da janela
 * 
 * @returns true se for dispositivo móvel, false caso contrário
 */
export function useIsMobile() {
  // Estado que armazena se é dispositivo móvel
  // Inicialmente é undefined até que o hook determine o valor
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // useEffect que configura o listener de mudanças de tamanho
  React.useEffect(() => {
    // Cria um MediaQueryList que verifica se a largura é menor que o breakpoint
    // max-width: 767px (MOBILE_BREAKPOINT - 1)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Função que atualiza o estado quando o tamanho da janela muda
    const onChange = () => {
      // Verifica se a largura atual é menor que o breakpoint
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Adiciona o listener para mudanças no MediaQueryList
    mql.addEventListener("change", onChange)
    
    // Define o valor inicial baseado na largura atual
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup: remove o listener quando o componente desmonta
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Retorna true se for mobile, false caso contrário
  // O !! converte undefined para false
  return !!isMobile
}

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
