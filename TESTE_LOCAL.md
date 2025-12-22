# 🧪 Guia Rápido para Testar Localmente

## Pré-requisitos

1. **Node.js** (v18 ou superior)
2. **PostgreSQL** instalado e rodando
3. **npm** ou **yarn**

## Passos para Testar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Base de Dados

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o `.env` e configure a `DATABASE_URL`:

```env
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/nome_do_banco
```

**Opções para PostgreSQL:**

#### Opção A: PostgreSQL Local
Se você tem PostgreSQL instalado localmente:
```bash
# Criar banco de dados
createdb senior_engineer_math

# Ou usando psql:
psql -U postgres
CREATE DATABASE senior_engineer_math;
```

#### Opção B: Docker (Mais Fácil)
Se você tem Docker instalado:
```bash
docker run --name postgres-dev -e POSTGRES_PASSWORD=senha123 -e POSTGRES_DB=senior_engineer_math -p 5432:5432 -d postgres:15
```

Então use no `.env`:
```env
DATABASE_URL=postgresql://postgres:senha123@localhost:5432/senior_engineer_math
```

#### Opção C: Serviço Online (Gratuito)
- **Supabase**: https://supabase.com (gratuito)
- **Neon**: https://neon.tech (gratuito)
- **Railway**: https://railway.app (gratuito)

Copie a connection string e cole no `.env`

### 3. Criar Tabelas no Banco

```bash
npm run db:push
```

Isso criará as tabelas necessárias no banco de dados.

### 4. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:5000`

### 5. Testar a Aplicação

Abra o navegador em: **http://localhost:5000**

## ✅ Checklist de Testes

- [ ] Aplicação carrega sem erros
- [ ] Consegue calcular integrais (teste com a função padrão)
- [ ] Gráfico é exibido corretamente
- [ ] Histórico de cálculos funciona
- [ ] Estatísticas são exibidas
- [ ] Exportação CSV/JSON funciona
- [ ] Filtros no histórico funcionam
- [ ] Paginação funciona

## 🐛 Problemas Comuns

### Erro: "DATABASE_URL must be set"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Verifique se a variável `DATABASE_URL` está configurada corretamente

### Erro: "Connection refused"
- Verifique se o PostgreSQL está rodando
- Verifique se a porta está correta (padrão: 5432)
- Verifique usuário e senha no `.env`

### Erro: "database does not exist"
- Crie o banco de dados primeiro
- Execute `npm run db:push` novamente

### Porta 5000 já em uso
- Altere a porta no `.env`: `PORT=3000`
- Ou pare o processo que está usando a porta 5000

## 🚀 Próximos Passos

Depois de testar localmente e confirmar que tudo funciona:

1. Faça commit das alterações
2. Configure o GitHub Pages (se necessário, ajuste para usar um backend)
3. Faça deploy

**Nota**: GitHub Pages serve apenas arquivos estáticos. Se você precisar do backend, considere:
- Vercel (full-stack gratuito)
- Railway
- Render
- Ou qualquer outro serviço que suporte Node.js

