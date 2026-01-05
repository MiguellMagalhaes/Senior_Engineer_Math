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
- **TanStack React Query** - Gestão de estado e cache
- **Wouter** - Routing leve para aplicações de página única
- **Lucide React** - Ícones SVG modernos e minimalistas

### Armazenamento
- **localStorage** - Armazenamento local no navegador para histórico de cálculos

---

## Arquitetura da Aplicação

### Estrutura de Pastas

```
├── client/                    # Frontend (React/Vite)
│   ├── src/
│   │   ├── components/        # Componentes React reutilizáveis
│   │   │   ├── CalculationForm.tsx    # Formulário de entrada
│   │   │   ├── FunctionChart.tsx      # Gráfico da função
│   │   │   └── MathResultCard.tsx     # Card de resultados
│   │   ├── hooks/             # React Hooks customizados
│   │   │   └── use-local-storage.ts   # Gestão de histórico local
│   │   ├── lib/               # Utilitários
│   │   │   └── math-utils.ts  # Lógica de integração numérica
│   │   ├── pages/             # Páginas da aplicação
│   │   │   └── Home.tsx       # Página principal
│   │   └── App.tsx            # Componente raiz
│   ├── index.html             # HTML principal
│   └── public/                # Arquivos estáticos
├── script/                    # Scripts de build
│   └── build.ts               # Script de build para produção
├── package.json               # Dependências e scripts
├── vite.config.ts             # Configuração do Vite
└── tsconfig.json              # Configuração do TypeScript
```

---

## Funcionalidades

### 1. Cálculo de Integrais Numéricos
- **Método**: Regra do Trapézio com refinamento adaptativo opcional
- **Precisão**: Configurável (100 a 10.000 subintervalos)
- **Estimativa de Erro**: Extrapolação de Richardson para estimar o erro
- **Validação**: Expressões matemáticas validadas com `math.js`

### 2. Visualização Gráfica
- Gráficos interativos da função integrada
- Visualização da área sob a curva
- Cores temáticas por tipo de cálculo

### 3. Histórico de Cálculos
- Armazenamento local no navegador (localStorage)
- Estatísticas básicas (total de cálculos, por tipo)
- Visualização dos últimos cálculos realizados

### 4. Três Contextos de Aplicação

#### Consumo Energético
- **Fórmula**: E = ∫ P(t) dt
- **Interpretação**: Energia total consumida (Wh/kWh)

#### Transferência de Dados
- **Fórmula**: D = ∫ R(t) dt
- **Interpretação**: Volume total de dados transferidos (Mb/MB)

#### Carga Computacional
- **Fórmula**: C = ∫ CPU(t) dt
- **Interpretação**: Carga acumulada do servidor

---

## Instalação e Execução

### Pré-requisitos
- Node.js 20 ou superior
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/Senior_Engineer_Math.git

# Entrar na pasta
cd Senior_Engineer_Math

# Instalar dependências
npm install
```

### Desenvolvimento Local

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

### Build para Produção

```bash
# Gerar build de produção
npm run build
```

Os arquivos estáticos serão gerados em `dist/public/`

---

## Deploy no GitHub Pages

### Método Automático (Recomendado)

1. **Ativar GitHub Pages**:
   - Vá em **Settings** → **Pages**
   - Em **Source**, selecione: **GitHub Actions**

2. **Fazer Push**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Aguardar Deploy**:
   - O GitHub Actions fará o build automaticamente
   - Aguarde 2-3 minutos
   - O site estará disponível em: `https://SEU_USUARIO.github.io/Senior_Engineer_Math/`

### Método Manual

1. **Build Local**:
   ```bash
   npm run build
   ```

2. **Configurar GitHub Pages**:
   - Vá em **Settings** → **Pages**
   - Em **Source**, selecione:
     - **Branch**: `main` (ou `gh-pages`)
     - **Folder**: `/dist/public`

3. **Fazer Push**:
   ```bash
   git add dist/public
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

---

## Módulos Matemáticos

### Integração Numérica

O projeto implementa a **Regra do Trapézio** para cálculo de integrais definidos:

```typescript
∫[a,b] f(x) dx ≈ (b-a)/n * [f(a)/2 + f(x₁) + f(x₂) + ... + f(xₙ₋₁) + f(b)/2]
```

**Características**:
- Método adaptativo opcional (refina em áreas de maior variação)
- Estimativa de erro usando extrapolação de Richardson
- Suporte para expressões matemáticas complexas via `math.js`

### Validação de Expressões

- Parsing seguro de expressões matemáticas
- Suporte para funções trigonométricas, exponenciais, logarítmicas
- Validação de sintaxe antes da execução

---

## Notas Importantes

### Armazenamento Local
- O histórico de cálculos é armazenado no `localStorage` do navegador
- Os dados são específicos de cada navegador/dispositivo
- Limpar o cache do navegador remove o histórico

### Compatibilidade
- Funciona em todos os navegadores modernos
- Requer JavaScript habilitado
- Funciona offline após o primeiro carregamento

### Limitações
- Histórico limitado a 100 cálculos (mais recentes são mantidos)
- Dados não são sincronizados entre dispositivos
- Não há persistência em servidor

---

## Contribuições

Este é um projeto académico desenvolvido para fins educacionais. Contribuições são bem-vindas!

---

## Licença

MIT License - Veja o arquivo LICENSE para mais detalhes.

---

## Autor

Desenvolvido para a unidade curricular de **Análise Matemática I** - Engenharia Informática, ISPGaya.

© 2024 Engenharia Informática - ISPGaya
