# 📐 Simulador de Integrais - Análise Matemática I

**Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, e proposto na unidade curricular de Análise Matemática I.**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://miguellmagalhaes.github.io/Senior_Engineer_Math/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](package.json)

## 🌐 Aplicação em Funcionamento

**🔗 [Aceder à Aplicação Online](https://miguellmagalhaes.github.io/Senior_Engineer_Math/)**

A aplicação está disponível online e pode ser utilizada diretamente no navegador, sem necessidade de instalação. Experimente calcular integrais e visualizar os resultados em tempo real!

## 📋 Índice

1. [Aplicação em Funcionamento](#-aplicação-em-funcionamento)
2. [Descrição do Projeto](#descrição-do-projeto)
3. [Funcionalidades](#funcionalidades)
4. [Tecnologias Utilizadas](#tecnologias-utilizadas)
5. [Estrutura do Projeto](#estrutura-do-projeto)
6. [Descrição dos Arquivos](#descrição-dos-arquivos)
7. [Instalação e Configuração](#instalação-e-configuração)
8. [Scripts Disponíveis](#scripts-disponíveis)
9. [Deploy](#deploy)
10. [Como Utilizar](#como-utilizar)
11. [Arquitetura e Decisões Técnicas](#arquitetura-e-decisões-técnicas)

---

## 📖 Descrição do Projeto

Este projeto é uma aplicação web interativa desenvolvida para demonstrar a aplicação prática do **cálculo integral** em problemas reais de engenharia. A aplicação permite aos utilizadores:

- Calcular integrais definidos de funções matemáticas
- Visualizar graficamente a área sob a curva
- Explorar três contextos práticos de aplicação:
  - **Consumo Energético**: Cálculo da energia total consumida através da integração da potência no tempo
  - **Transferência de Dados**: Cálculo do volume total de dados através da integração da taxa de transferência
  - **Carga Computacional**: Cálculo da carga acumulada através da integração da utilização da CPU

A aplicação é uma **Single Page Application (SPA)** construída com React e TypeScript, totalmente funcional no lado do cliente, sem necessidade de servidor backend.

---

## ✨ Funcionalidades

### 🧮 Cálculo de Integrais
- **Regra do Trapézio**: Método numérico padrão para cálculo de integrais
- **Método Adaptativo**: Refina automaticamente em áreas de maior variação
- **Estimativa de Erro**: Calcula o erro estimado usando extrapolação de Richardson
- **Validação de Expressões**: Sistema de segurança que valida expressões matemáticas antes de executar

### 📊 Visualização
- **Gráficos Interativos**: Visualização da função e área sob a curva usando Recharts
- **Tooltips Informativos**: Informações detalhadas ao passar o rato sobre os pontos do gráfico
- **Cores Contextuais**: Cada contexto (energia, rede, CPU) tem sua própria paleta de cores

### 📝 Histórico e Estatísticas
- **Histórico Local**: Armazena os últimos 100 cálculos no localStorage do navegador
- **Estatísticas**: Mostra total de cálculos e distribuição por tipo
- **Persistência**: O histórico persiste entre sessões do navegador

### 🎨 Interface do Utilizador
- **Design Moderno**: Interface limpa e intuitiva usando Tailwind CSS e Shadcn/UI
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Animações Suaves**: Transições e animações para melhor experiência do utilizador
- **Feedback Visual**: Notificações toast para sucesso e erros

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **React 18.3.1**: Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.6.3**: Superset do JavaScript com tipagem estática
- **Vite 7.3.0**: Build tool moderna e rápida
- **Wouter 3.3.5**: Roteamento leve para React (alternativa ao React Router)
- **TanStack React Query 5.60.5**: Gestão de estado e cache (preparado para futuras APIs)

### UI e Estilização
- **Tailwind CSS 3.4.17**: Framework CSS utility-first
- **Shadcn/UI**: Componentes UI acessíveis baseados em Radix UI
- **Radix UI**: Componentes primitivos acessíveis
- **Lucide React**: Biblioteca de ícones moderna
- **Framer Motion**: Biblioteca de animações

### Matemática e Gráficos
- **Math.js 15.1.0**: Biblioteca para parsing e avaliação segura de expressões matemáticas
- **Recharts 2.15.4**: Biblioteca para criação de gráficos React

### Formulários e Validação
- **React Hook Form 7.55.0**: Biblioteca para gestão eficiente de formulários
- **Zod 3.24.2**: Biblioteca de validação de esquemas TypeScript-first

### Ferramentas de Desenvolvimento
- **ESBuild**: Compilador JavaScript rápido
- **PostCSS**: Processador CSS
- **Autoprefixer**: Adiciona prefixos de vendor automaticamente
- **TSX**: Executor TypeScript para Node.js

---

## 📁 Estrutura do Projeto

```
Senior_Engineer_Math/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Workflow GitHub Actions para deploy automático
├── attached_assets/            # Assets anexados (não usados no código)
├── client/                     # Código fonte do frontend
│   ├── public/
│   │   └── favicon.png        # Ícone da aplicação
│   ├── src/
│   │   ├── components/        # Componentes React reutilizáveis
│   │   │   ├── CalculationForm.tsx    # Formulário de entrada
│   │   │   ├── FunctionChart.tsx       # Componente de gráfico
│   │   │   ├── MathResultCard.tsx      # Card de resultados
│   │   │   └── ui/            # Componentes UI do Shadcn/UI
│   │   ├── hooks/             # Custom hooks React
│   │   │   ├── use-local-storage.ts    # Hook para histórico
│   │   │   ├── use-mobile.tsx          # Hook para detecção mobile
│   │   │   └── use-toast.ts            # Hook para notificações
│   │   ├── lib/               # Bibliotecas e utilitários
│   │   │   ├── math-utils.ts           # Lógica matemática de integração
│   │   │   ├── queryClient.ts          # Configuração React Query
│   │   │   └── utils.ts                # Funções utilitárias
│   │   ├── pages/             # Páginas da aplicação
│   │   │   ├── Home.tsx                # Página principal
│   │   │   └── not-found.tsx           # Página 404
│   │   ├── App.tsx            # Componente raiz da aplicação
│   │   ├── main.tsx           # Ponto de entrada
│   │   └── index.css          # Estilos globais
│   └── index.html             # Template HTML principal
├── dist/                      # Ficheiros compilados (gerado no build)
│   └── public/               # Build de produção
├── script/                    # Scripts auxiliares
│   ├── build.ts              # Script de build personalizado
│   └── ...                   # Outros scripts (não usados)
├── server/                   # Código do servidor (não usado na versão atual)
├── shared/                   # Código compartilhado (não usado na versão atual)
├── node_modules/             # Dependências instaladas
├── .gitignore               # Ficheiros ignorados pelo Git
├── components.json          # Configuração do Shadcn/UI
├── package.json             # Dependências e scripts do projeto
├── package-lock.json        # Lock file das dependências
├── postcss.config.js        # Configuração do PostCSS
├── tailwind.config.ts       # Configuração do Tailwind CSS
├── tsconfig.json            # Configuração do TypeScript
└── vite.config.ts           # Configuração do Vite
```

---

## 📄 Descrição dos Arquivos

### 🎯 Arquivos Principais

#### `client/src/App.tsx`
**Componente raiz da aplicação React.** Define a estrutura de roteamento usando Wouter e envolve a aplicação com os providers necessários (React Query, Tooltip, Toast). Configura o caminho base (`base`) para funcionar corretamente no GitHub Pages.

#### `client/src/main.tsx`
**Ponto de entrada da aplicação.** Monta o componente `App` no elemento `root` do HTML usando a API moderna `createRoot` do React 18+.

#### `client/src/pages/Home.tsx`
**Página principal da aplicação.** Implementa toda a interface do simulador:
- Três separadores (tabs) para os diferentes contextos (Energia, Rede, CPU)
- Formulário de entrada de parâmetros
- Visualização de resultados e gráficos
- Histórico de cálculos
- Estatísticas

#### `client/src/pages/not-found.tsx`
**Página de erro 404.** Exibida quando o utilizador acede a uma rota inexistente. Inclui informações de debug em modo de desenvolvimento.

### 🧮 Componentes

#### `client/src/components/CalculationForm.tsx`
**Formulário de entrada para os parâmetros do cálculo.** Permite ao utilizador:
- Inserir a expressão matemática da função
- Definir o intervalo de tempo (t1, t2)
- Escolher o método de cálculo (trapézio ou adaptativo)
- Configurar o número de subintervalos
- Validação em tempo real usando React Hook Form e Zod

#### `client/src/components/FunctionChart.tsx`
**Componente de gráfico interativo.** Usa Recharts para visualizar:
- A função matemática como uma curva
- A área sob a curva (representando o integral)
- Tooltips informativos ao passar o rato
- Cores personalizáveis por contexto

#### `client/src/components/MathResultCard.tsx`
**Card visual que exibe o resultado do cálculo.** Mostra:
- Valor do integral calculado
- Unidade de medida
- Valor secundário (conversão, ex: Wh → kWh)
- Interpretação física do resultado
- Informações técnicas (erro estimado, número de subintervalos)

### 🔧 Bibliotecas e Utilitários

#### `client/src/lib/math-utils.ts`
**Núcleo matemático da aplicação.** Contém:
- **`calculateIntegral()`**: Função principal que calcula integrais usando a Regra do Trapézio
- **`calculateAdaptiveIntegral()`**: Implementação do método adaptativo
- **`evaluateFunction()`**: Avalia expressões matemáticas de forma segura
- **`validateExpression()`**: Valida expressões para prevenir injeção de código
- Sistema de cache para otimizar cálculos repetidos
- Estimativa de erro usando extrapolação de Richardson

**Algoritmos Implementados:**
- **Regra do Trapézio**: `∫[a,b] f(x) dx ≈ (b-a)/n * [f(a)/2 + f(x₁) + ... + f(xₙ₋₁) + f(b)/2]`
- **Método Adaptativo**: Divide recursivamente o intervalo até atingir tolerância
- **Extrapolação de Richardson**: Estima erro comparando resultados com diferentes números de subintervalos

#### `client/src/lib/queryClient.ts`
**Configuração do TanStack React Query.** Define opções globais para queries e mutations. Atualmente não é usado (aplicação sem backend), mas está preparado para futuras integrações com APIs.

#### `client/src/lib/utils.ts`
**Funções utilitárias.** Principalmente a função `cn()` que combina classes CSS usando `clsx` e `tailwind-merge`.

### 🪝 Custom Hooks

#### `client/src/hooks/use-local-storage.ts`
**Hook para gestão do histórico de cálculos.** Implementa:
- Carregamento automático do histórico do localStorage
- Guardar novos cálculos
- Limpar histórico
- Obter estatísticas (total, por tipo, média)
- Limite de 100 cálculos (mantém apenas os mais recentes)

#### `client/src/hooks/use-mobile.tsx`
**Hook para detecção de dispositivos móveis.** Retorna `true` se a largura da janela for menor que 768px.

#### `client/src/hooks/use-toast.ts`
**Hook para exibir notificações toast.** Sistema de notificações baseado em reducer pattern, permite exibir mensagens de sucesso, erro, etc.

### ⚙️ Configuração

#### `vite.config.ts`
**Configuração do Vite (build tool).** Define:
- Plugins (React, error overlay)
- Aliases de caminhos (`@/` → `client/src/`)
- Caminho base para GitHub Pages (`base: process.env.GITHUB_PAGES_BASE || "/"`)
- Pasta de saída do build (`dist/public`)
- Configurações do servidor de desenvolvimento

#### `tsconfig.json`
**Configuração do TypeScript.** Define:
- Opções do compilador (strict mode, ES modules)
- Paths aliases (`@/*`, `@shared/*`)
- Tipos incluídos (Node, Vite)
- Pastas incluídas/excluídas

#### `tailwind.config.ts`
**Configuração do Tailwind CSS.** Define:
- Cores personalizadas do tema (primary, secondary, muted, etc.)
- Fontes (sans, serif, mono)
- Animações customizadas
- Plugins (animate, typography)

#### `package.json`
**Manifesto do projeto Node.js.** Contém:
- Dependências do projeto
- Scripts disponíveis (`dev`, `build`, `preview`, `check`)
- Metadados (nome, versão, licença)

### 🔨 Scripts

#### `script/build.ts`
**Script de build personalizado.** Executa:
1. Remove a pasta `dist` anterior
2. Compila o projeto com Vite
3. Cria o ficheiro `404.html` (cópia de `index.html`) necessário para GitHub Pages funcionar com SPAs

### 🚀 Deploy

#### `.github/workflows/deploy.yml`
**Workflow GitHub Actions para deploy automático.** Quando há push para `main`:
1. Faz checkout do código
2. Instala dependências
3. Compila o projeto
4. Faz deploy para GitHub Pages

#### `client/index.html`
**Template HTML principal.** Contém:
- Estrutura básica HTML5
- Meta tags (charset, viewport)
- Favicon
- Links para Google Fonts
- Div `root` onde React monta a aplicação
- Script que carrega `main.tsx`

---

## 🚀 Instalação e Configuração

### Pré-requisitos
- **Node.js** 20 ou superior
- **npm** (vem com Node.js) ou **yarn**

### Passos de Instalação

1. **Clone o repositório** (ou faça download do código)
   ```bash
   git clone <url-do-repositório>
   cd Senior_Engineer_Math
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Abra no navegador**
   - A aplicação estará disponível em `http://localhost:5173` (ou outra porta se 5173 estiver ocupada)

---

## 📜 Scripts Disponíveis

### `npm run dev`
Inicia o servidor de desenvolvimento Vite. A aplicação recarrega automaticamente quando há alterações no código.

### `npm run build`
Compila o projeto para produção. Gera os ficheiros otimizados na pasta `dist/public`. Também cria o `404.html` necessário para GitHub Pages.

### `npm run preview`
Pré-visualiza o build de produção localmente. Útil para testar como a aplicação ficará em produção.

### `npm run check`
Executa o TypeScript compiler em modo de verificação (sem gerar ficheiros). Verifica se há erros de tipo no código.

---

## 🌐 Deploy

### GitHub Pages (Atual)

O projeto está configurado para deploy automático no GitHub Pages através de GitHub Actions.

**Como funciona:**
1. Quando há push para a branch `main`, o workflow `.github/workflows/deploy.yml` é executado
2. O workflow compila o projeto com `GITHUB_PAGES_BASE=/Senior_Engineer_Math/`
3. Os ficheiros são publicados automaticamente no GitHub Pages

**URL do site:**
- **🔗 [https://miguellmagalhaes.github.io/Senior_Engineer_Math/](https://miguellmagalhaes.github.io/Senior_Engineer_Math/)**

**Nota:** Certifique-se de que o GitHub Pages está habilitado nas configurações do repositório e configurado para usar "GitHub Actions" como fonte.

### Deploy Manual

Se preferir fazer deploy manual:

1. **Compile o projeto:**
   ```bash
   npm run build
   ```

2. **Faça upload da pasta `dist/public`** para o seu servidor de hospedagem estática

---

## 💡 Como Utilizar

### 1. Escolher Contexto
Na página principal, escolha um dos três separadores:
- **Consumo Energético**: Para calcular energia (Wh/kWh)
- **Dados de Rede**: Para calcular volume de dados (Mb/MB)
- **Carga do Servidor**: Para calcular carga computacional

### 2. Inserir Parâmetros
- **Função**: Digite a expressão matemática (ex: `100 + 20*t`, `50 + 10*sin(t)`)
- **Início (t1)**: Tempo inicial do intervalo
- **Fim (t2)**: Tempo final do intervalo (deve ser maior que t1)

### 3. Opções Avançadas (Opcional)
Clique em "Opções Avançadas" para:
- **Método Adaptativo**: Ativa cálculo adaptativo (mais preciso, mais lento)
- **Subintervalos**: Ajusta o número de subintervalos (100-10000, padrão: 1000)

### 4. Calcular
Clique em "Calcular Integral Definido" e aguarde o resultado.

### 5. Visualizar Resultados
- **Card de Resultado**: Mostra o valor calculado, unidade, interpretação física
- **Gráfico**: Visualiza a função e a área sob a curva
- **Histórico**: Veja os últimos cálculos realizados

### Exemplos de Expressões Matemáticas

- **Linear**: `100 + 20*t`
- **Seno**: `50 + 10*sin(t)`
- **Polinomial**: `t^2 + 10`
- **Exponencial**: `10*exp(-t/5)`
- **Racional**: `30 + 40*t/(t+10)`

**Funções Disponíveis:**
- Trigonométricas: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`
- Hiperbólicas: `sinh`, `cosh`, `tanh`
- Logarítmicas: `log`, `log10`, `log2`
- Outras: `sqrt`, `exp`, `abs`, `pow`, `floor`, `ceil`, `round`, `min`, `max`

**Variáveis Disponíveis:**
- `t`: Variável de tempo (principal)
- `pi`: Constante π (3.14159...)
- `e`: Constante de Euler (2.71828...)

---

## 🏗 Arquitetura e Decisões Técnicas

### Arquitetura Frontend-Only
A aplicação foi simplificada para funcionar **100% no cliente**, sem necessidade de backend. Isto permite:
- Deploy simples em GitHub Pages (hospedagem estática)
- Sem custos de servidor
- Funcionamento offline (após carregar a página)
- Histórico armazenado localmente (localStorage)

### Segurança
- **Validação de Expressões**: Sistema de whitelist que permite apenas funções matemáticas seguras
- **Prevenção de Injeção**: Bloqueia palavras-chave perigosas (`eval`, `function`, `import`, etc.)
- **Sanitização**: Usa `math.js` que compila expressões de forma segura

### Performance
- **Cache de Cálculos**: Resultados são guardados em cache para evitar recálculos
- **Amostragem de Pontos**: O gráfico não mostra todos os pontos calculados (apenas ~200) para melhor performance
- **Lazy Loading**: Componentes são carregados apenas quando necessários

### Responsividade
- **Mobile-First**: Design pensado primeiro para mobile
- **Breakpoints**: Usa breakpoints do Tailwind (sm, md, lg, xl)
- **Hook useIsMobile**: Detecta dispositivos móveis para ajustar UI

### Acessibilidade
- **Shadcn/UI**: Componentes baseados em Radix UI (acessíveis por padrão)
- **ARIA Labels**: Componentes incluem labels apropriados
- **Keyboard Navigation**: Navegação por teclado funcional

### Escalabilidade
- **TypeScript**: Tipagem estática previne erros e facilita manutenção
- **Componentes Reutilizáveis**: Estrutura modular permite fácil expansão
- **React Query**: Preparado para futuras integrações com APIs

---

## 📚 Conceitos Matemáticos Aplicados

### Integral Definido
O integral definido de uma função f(t) no intervalo [a, b] representa a área sob a curva:

```
∫[a,b] f(t) dt = Área sob a curva de f(t) entre a e b
```

### Regra do Trapézio
Método numérico que aproxima o integral dividindo a área em trapézios:

```
∫[a,b] f(x) dx ≈ (b-a)/n * [f(a)/2 + f(x₁) + f(x₂) + ... + f(xₙ₋₁) + f(b)/2]
```

Onde `n` é o número de subintervalos.

### Aplicações Práticas

1. **Energia = Integral da Potência**
   ```
   E = ∫[t₁,t₂] P(t) dt
   ```
   A energia consumida é a área sob a curva de potência.

2. **Volume de Dados = Integral da Taxa de Transferência**
   ```
   D = ∫[t₁,t₂] R(t) dt
   ```
   O volume total de dados é a área sob a curva de taxa de transferência.

3. **Carga Computacional = Integral da Utilização da CPU**
   ```
   C = ∫[t₁,t₂] CPU(t) dt
   ```
   A carga total é a área sob a curva de utilização da CPU.

---

## 🐛 Resolução de Problemas

### Erro: "Expressão contém código não permitido"
- **Causa**: A expressão contém palavras-chave bloqueadas por segurança
- **Solução**: Use apenas funções matemáticas permitidas (ver lista acima)

### Erro: "O tempo final deve ser maior que o inicial"
- **Causa**: t2 ≤ t1
- **Solução**: Certifique-se de que t2 > t1

### Erro: "Invalid math expression"
- **Causa**: Sintaxe incorreta na expressão
- **Solução**: Verifique a sintaxe (ex: use `*` para multiplicação, não `x`)

### Gráfico não aparece
- **Causa**: Pode ser um problema de renderização
- **Solução**: Recarregue a página ou verifique se o cálculo foi concluído

### Histórico não persiste
- **Causa**: localStorage pode estar desabilitado ou cheio
- **Solução**: Verifique as configurações do navegador

---

## 📝 Notas de Desenvolvimento

### Estrutura de Pastas
- **`client/src/components/ui/`**: Componentes UI do Shadcn/UI (gerados automaticamente)
- **`client/src/components/`**: Componentes específicos da aplicação
- **`client/src/lib/`**: Bibliotecas e utilitários
- **`client/src/hooks/`**: Custom hooks React
- **`client/src/pages/`**: Páginas/rotas da aplicação

### Convenções de Código
- **TypeScript**: Todo o código está tipado
- **Naming**: Componentes em PascalCase, funções em camelCase
- **Comentários**: Código extensivamente comentado em português
- **Imports**: Usa aliases (`@/`) para caminhos absolutos

### Futuras Melhorias
- [ ] Adicionar mais métodos de integração (Simpson, Romberg)
- [ ] Exportar resultados para PDF/CSV
- [ ] Comparação de múltiplas funções
- [ ] Modo escuro/claro
- [ ] Internacionalização (i18n)
- [ ] Integração com backend para histórico partilhado

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o ficheiro `package.json` para mais detalhes.

---

## 👤 Autor

**Miguel Magalhães**
- Aluno de Engenharia Informática
- ISPGaya
- Unidade Curricular: Análise Matemática I

---

## 🙏 Agradecimentos

- **ISPGaya** pela oportunidade de desenvolver este projeto
- **Professores** de Análise Matemática I pelo suporte
- **Comunidade Open Source** pelas bibliotecas utilizadas

---

**Trabalho realizado por Miguel Magalhães, Helder Rocha e David Borges, alunos de Engenharia Informática, e proposto na unidade curricular de Análise Matemática I.**

