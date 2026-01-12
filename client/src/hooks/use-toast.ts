/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 * 
 * Este ficheiro contém o hook useToast e o sistema de gestão de notificações toast.
 * Implementa um sistema de notificações baseado em reducer pattern para exibir mensagens
 * de sucesso, erro, aviso, etc. na interface do utilizador.
 */

// Importa React para usar hooks e tipos
import * as React from "react"

// Importa tipos do componente Toast
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Limite máximo de toasts visíveis simultaneamente
const TOAST_LIMIT = 1

// Tempo em milissegundos antes de remover automaticamente um toast
const TOAST_REMOVE_DELAY = 1000000

/**
 * Tipo que estende ToastProps com propriedades adicionais
 * Define a estrutura completa de um toast
 */
type ToasterToast = ToastProps & {
  id: string                    // Identificador único do toast
  title?: React.ReactNode       // Título do toast (opcional)
  description?: React.ReactNode // Descrição do toast (opcional)
  action?: ToastActionElement   // Ação opcional (botão, etc.)
}

/**
 * Objeto com constantes para os tipos de ações do reducer
 * Define as ações possíveis para gerir o estado dos toasts
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",           // Adicionar um novo toast
  UPDATE_TOAST: "UPDATE_TOAST",     // Atualizar um toast existente
  DISMISS_TOAST: "DISMISS_TOAST",    // Dispensar um toast (fechar)
  REMOVE_TOAST: "REMOVE_TOAST",     // Remover um toast completamente
} as const

// Contador global para gerar IDs únicos para toasts
let count = 0

/**
 * Função que gera um ID único para cada toast
 * Usa um contador incremental
 * 
 * @returns String com o ID único
 */
function genId() {
  // Incrementa o contador e usa módulo para evitar overflow
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  // Retorna o contador como string
  return count.toString()
}

// Tipo que representa os tipos de ação disponíveis
type ActionType = typeof actionTypes

/**
 * Union type que define todas as ações possíveis do reducer
 * Cada ação tem um tipo e dados específicos
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"]    // Ação: adicionar toast
      toast: ToasterToast              // Dados do toast a adicionar
    }
  | {
      type: ActionType["UPDATE_TOAST"]  // Ação: atualizar toast
      toast: Partial<ToasterToast>      // Dados parciais do toast a atualizar
    }
  | {
      type: ActionType["DISMISS_TOAST"] // Ação: dispensar toast
      toastId?: ToasterToast["id"]      // ID do toast a dispensar (opcional, se não fornecido, dispensa todos)
    }
  | {
      type: ActionType["REMOVE_TOAST"]  // Ação: remover toast
      toastId?: ToasterToast["id"]      // ID do toast a remover (opcional, se não fornecido, remove todos)
    }

/**
 * Interface que define o estado do sistema de toasts
 * Contém um array com todos os toasts ativos
 */
interface State {
  toasts: ToasterToast[] // Array de toasts ativos
}

// Map que armazena os timeouts de remoção automática de cada toast
// A chave é o ID do toast, o valor é o timeout
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Função que adiciona um toast à fila de remoção automática
 * Após TOAST_REMOVE_DELAY milissegundos, o toast será removido
 * 
 * @param toastId - ID do toast a adicionar à fila de remoção
 */
const addToRemoveQueue = (toastId: string) => {
  // Se já existe um timeout para este toast, não cria outro
  if (toastTimeouts.has(toastId)) {
    return
  }

  // Cria um timeout que remove o toast após o delay
  const timeout = setTimeout(() => {
    // Remove o timeout do map
    toastTimeouts.delete(toastId)
    // Despacha ação para remover o toast
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  // Guarda o timeout no map
  toastTimeouts.set(toastId, timeout)
}

/**
 * Reducer que gerencia o estado dos toasts
 * Processa as ações e retorna o novo estado
 * 
 * @param state - Estado atual dos toasts
 * @param action - Ação a processar
 * @returns Novo estado dos toasts
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // Adiciona o novo toast no início do array
      // Limita o número de toasts ao TOAST_LIMIT (mantém apenas os mais recentes)
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      // Atualiza um toast existente com base no ID
      // Se o ID corresponder, mescla as propriedades antigas com as novas
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      // Extrai o ID do toast da ação
      const { toastId } = action

      // Efeito colateral: adiciona toasts à fila de remoção
      // Se um toastId específico foi fornecido, adiciona apenas esse
      // Caso contrário, adiciona todos os toasts à fila
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      // Marca os toasts como fechados (mas não os remove ainda)
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Marca como fechado
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      // Remove um toast completamente do array
      // Se toastId for undefined, remove todos os toasts
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      // Remove apenas o toast com o ID especificado
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Array de listeners (funções que são chamadas quando o estado muda)
// Permite que múltiplos componentes subscrevam mudanças no estado dos toasts
const listeners: Array<(state: State) => void> = []

// Estado em memória dos toasts (fora do React)
// Isto permite que o estado persista mesmo quando componentes são desmontados
let memoryState: State = { toasts: [] }

/**
 * Função que despacha uma ação e notifica todos os listeners
 * Atualiza o estado em memória e chama todos os listeners registados
 * 
 * @param action - Ação a despachar
 */
function dispatch(action: Action) {
  // Atualiza o estado em memória usando o reducer
  memoryState = reducer(memoryState, action)
  // Notifica todos os listeners sobre a mudança de estado
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Tipo que representa um toast sem o ID (usado para criar novos toasts)
type Toast = Omit<ToasterToast, "id">

/**
 * Função que cria e exibe um novo toast
 * Retorna funções para atualizar e dispensar o toast
 * 
 * @param props - Propriedades do toast (sem ID, que é gerado automaticamente)
 * @returns Objeto com id, dismiss e update
 */
function toast({ ...props }: Toast) {
  // Gera um ID único para este toast
  const id = genId()

  // Função para atualizar este toast específico
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  
  // Função para dispensar este toast específico
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Despacha ação para adicionar o toast
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true, // Toast começa aberto
      onOpenChange: (open) => {
        // Quando o toast é fechado (open = false), dispensa-o
        if (!open) dismiss()
      },
    },
  })

  // Retorna funções para controlar o toast
  return {
    id: id,      // ID do toast
    dismiss,     // Função para dispensar
    update,      // Função para atualizar
  }
}

/**
 * Hook React que permite usar o sistema de toasts em componentes
 * Subscreve mudanças no estado dos toasts e retorna o estado atual
 * 
 * @returns Objeto com toasts, toast (função para criar), e dismiss (função para dispensar)
 */
function useToast() {
  // Estado local que sincroniza com o estado em memória
  const [state, setState] = React.useState<State>(memoryState)

  // useEffect que subscreve mudanças no estado
  React.useEffect(() => {
    // Adiciona setState como listener
    listeners.push(setState)
    // Cleanup: remove o listener quando o componente desmonta
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  // Retorna o estado atual e funções para criar e dispensar toasts
  return {
    ...state,
    toast,      // Função para criar um novo toast
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }), // Função para dispensar toast(s)
  }
}

// Exporta o hook e a função toast
export { useToast, toast }

/**
 * Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, 
 * e proposto na unidade curricular de Análise Matemática I.
 */
