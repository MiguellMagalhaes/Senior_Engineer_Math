# Análise Matemática I - Aplicações do Cálculo Integral

## Contexto do Projeto

Este é um projeto académico desenvolvido para a unidade curricular de **Análise Matemática I** no programa de Engenharia Informática do Instituto Superior Politécnico de Gaya (ISPGaya).

O projeto demonstra, de forma matematicamente rigorosa, três aplicações reais do cálculo integral em Engenharia e Ciência de Computadores:
1. **Cálculo do Consumo Energético** - Integração de potência para obter energia
2. **Cálculo de Dados Transferidos numa Rede** - Integração de taxa de transferência para obter volume de dados
3. **Carga Computacional de um Servidor** - Integração de utilização de CPU para obter carga acumulada

---

## Tecnologias Utilizadas

### Frontend
- **React 18** - Framework JavaScript para construção da interface de utilizador
- **TypeScript** - Tipagem estática para JavaScript, melhorando a segurança e qualidade do código
- **Vite** - Ferramenta de build rápida e moderna para desenvolvimento web
- **Tailwind CSS** - Framework CSS utilitário para styling responsivo e consistente
- **Shadcn/UI** - Componentes React acessíveis e reutilizáveis baseados em Radix UI
- **math.js** - Biblioteca para parsing e avaliação de expressões matemáticas
- **recharts** - Biblioteca de gráficos React para visualização de dados
- **React Hook Form** - Gestão eficiente de formulários React
- **TanStack React Query** - Gestão de dados remotos e cache
- **Wouter** - Routing leve para aplicações de página única
- **Lucide React** - Ícones SVG modernos e minimalistas

### Backend
- **Express.js** - Framework Node.js para criar APIs REST
- **TypeScript** - Mesmo como frontend, para consistência
- **Drizzle ORM** - ORM tipo-seguro para interação com bases de dados
- **PostgreSQL** - Base de dados relacional robusta
- **Zod** - Validação e parsing de esquemas com tipos TypeScript

### Ferramentas de Desenvolvimento
- **npm** - Gestor de pacotes Node.js
- **Tailwind CSS** - Processamento de CSS utilitário
- **Prettier** - Formatação de código
- **ESLint** - Linting de código JavaScript/TypeScript

---

## Arquitetura da Aplicação

### Estrutura de Pastas

```
├── client/                    # Frontend (React/Vite)
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── ui/          # Componentes base (Shadcn/UI)
│   │   │   ├── CalculationForm.tsx      # Formulário para entrada de dados
│   │   │   ├── FunctionChart.tsx        # Gráfico da função matemática
│   │   │   └── MathResultCard.tsx       # Card com resultados
│   │   ├── hooks/            # Custom React hooks
│   │   │   └── use-calculations.ts      # Hook para API de cálculos
│   │   ├── lib/
│   │   │   ├── math-utils.ts           # Integração numérica
│   │   │   └── queryClient.ts          # Configuração do React Query
│   │   ├── pages/            # Páginas da aplicação
│   │   │   └── Home.tsx      # Página principal
│   │   ├── App.tsx           # Componente raiz
│   │   └── main.tsx          # Ponto de entrada
│   └── index.html            # Arquivo HTML base
├── server/                    # Backend (Express.js)
│   ├── index.ts              # Ponto de entrada do servidor
│   ├── routes.ts             # Definição de rotas API
│   ├── storage.ts            # Camada de armazenamento (DatabaseStorage)
│   ├── db.ts                 # Configuração Drizzle/PostgreSQL
│   └── vite.ts               # Integração Vite
├── shared/                    # Código partilhado entre frontend e backend
│   ├── schema.ts             # Definição de tabelas Drizzle e tipos Zod
│   └── routes.ts             # Contrato de API (esquemas de requisição/resposta)
└── package.json              # Dependências do projeto
```

### Fluxo de Dados

```
Frontend (React)
  ↓
CalculationForm (entrada do utilizador)
  ↓
calculateIntegral() (math-utils.ts) → Integração numérica em tempo real
  ↓
FunctionChart (visualização) + MathResultCard (resultado)
  ↓
useCreateCalculation hook → POST /api/calculations
  ↓
Backend (Express)
  ↓
storage.createCalculation() → DatabaseStorage
  ↓
PostgreSQL (persistência)
```

---

## Módulos Matemáticos

### 1. Consumo Energético
**Modelo Matemático:**
```
E = ∫[t₁,t₂] P(t) dt
```

- **P(t)**: Função de potência (Watts)
- **t**: Tempo (horas)
- **E**: Energia total (Watt-hora)

**Exemplo:** `P(t) = 100 + 20*t`
- Entrada: função de potência, tempo inicial e final
- Saída: Energia em Wh e kWh
- **Interpretação:** A energia é a área sob a curva de potência ao longo do tempo.

---

### 2. Transferência de Dados numa Rede
**Modelo Matemático:**
```
D = ∫[t₁,t₂] R(t) dt
```

- **R(t)**: Taxa de transferência (Megabits por segundo)
- **t**: Tempo (segundos)
- **D**: Total de dados transferidos (Megabits)

**Exemplo:** `R(t) = 50 + 10*sin(t)`
- Entrada: função de taxa de transferência, tempo inicial e final
- Saída: Dados em Mb e MB
- **Interpretação:** O volume de dados é a área sob a curva de taxa de transferência ao longo do tempo.

---

### 3. Carga Computacional de um Servidor
**Modelo Matemático:**
```
C = ∫[t₁,t₂] CPU(t) dt
```

- **CPU(t)**: Utilização de CPU (0–100%)
- **t**: Tempo (segundos)
- **C**: Carga computacional acumulada

**Exemplo:** `CPU(t) = 30 + 40*t/(t+10)`
- Entrada: função de utilização CPU, tempo inicial e final
- Saída: Carga computacional acumulada
- **Interpretação:** Indicador útil para análise de desempenho e planeamento de recursos.

---

## Métodos Numéricos

### Integração Numérica
O projeto utiliza a **Regra dos Trapézios Composta** com subdivisions adaptativas para aproximação numérica de integrais:

```typescript
Σ(i=0 até n-1) [(f(xᵢ) + f(xᵢ₊₁)) / 2] × Δx
```

Onde:
- **n**: Número de subintervalos (1000 por padrão)
- **Δx**: Largura de cada subintervalo `(t₂ - t₁) / n`
- **f(xᵢ)**: Avaliação da função em cada ponto

Esta abordagem oferece um bom equilíbrio entre precisão e desempenho para aplicações interactivas.

---

## Como Executar

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn
- Base de dados PostgreSQL (fornecida automaticamente no Replit)

### Instalação e Execução

1. **Clonar/Abrir o projeto:**
   ```bash
   cd /path/to/project
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Configurar base de dados:**
   ```bash
   npm run db:push
   ```

4. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

   A aplicação estará disponível em `http://localhost:5000`

### Variáveis de Ambiente
- `DATABASE_URL` - String de conexão PostgreSQL (configurada automaticamente)
- `VITE_API_URL` - URL da API (padrão: `/api`)

---

## API REST

### Endpoints

#### POST `/api/calculations`
Criar um novo cálculo e persistir na base de dados.

**Requisição:**
```json
{
  "type": "energy|network|cpu",
  "functionExpression": "100 + 20*t",
  "t1": 0,
  "t2": 10,
  "result": 15000.5
}
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "type": "energy",
  "functionExpression": "100 + 20*t",
  "t1": 0,
  "t2": 10,
  "result": 15000.5,
  "createdAt": "2025-12-21T10:30:00Z"
}
```

#### GET `/api/calculations`
Obter histórico de todos os cálculos.

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "type": "energy",
    "functionExpression": "100 + 20*t",
    "t1": 0,
    "t2": 10,
    "result": 15000.5,
    "createdAt": "2025-12-21T10:30:00Z"
  }
]
```

---

## Validação de Entrada

### Expressões Matemáticas
- Variável independente: `t`
- Operadores suportados: `+`, `-`, `*`, `/`, `^` (potência)
- Funções suportadas: `sin`, `cos`, `tan`, `sqrt`, `log`, `exp`, etc.
- Exemplos válidos:
  - `100 + 20*t`
  - `50 + 10*sin(t)`
  - `30 + 40*t/(t+10)`
  - `100*exp(-0.1*t)`

### Validação de Intervalos
- `t1` e `t2` devem ser números
- `t2` > `t1` (obrigatório)
- Ambos os valores válidos no contexto do problema

---

## Funcionalidades

✅ **Cálculo em Tempo Real** - Resultados imediatos ao modificar parâmetros
✅ **Visualização Gráfica** - Gráficos interactivos da função de integração
✅ **Persistência de Dados** - Histórico de cálculos guardado em BD
✅ **Validação Robusta** - Validação de expressões matemáticas e intervalos
✅ **Interface Responsiva** - Funciona em desktop, tablet e mobile
✅ **Interpretação Matemática** - Explicação clara do significado de cada resultado
✅ **Design Académico** - Interface limpa e focada no rigor matemático

---

## Notas Importantes

- **Rigor Matemático**: Todos os cálculos seguem as definições clássicas de cálculo integral
- **Segurança**: A library `math.js` é utilizada para parsing seguro de expressões
- **Performance**: Integração numérica otimizada com 1000 subintervalos
- **Responsividade**: Actualizações instantâneas sem recarregar a página

---

## Autor e Contexto

Projeto académico desenvolvido para a unidade curricular de **Análise Matemática I** no programa de **Engenharia Informática** do **Instituto Superior Politécnico de Gaya**.

---

## Licença

Este projeto é fornecido para fins educacionais.

---

**Última Actualização:** Dezembro de 2025
