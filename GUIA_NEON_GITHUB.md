# 🚀 Guia Completo: Neon + GitHub Pages

## Parte 1: Configurar Neon (PostgreSQL Online)

### Passo 1: Criar Conta no Neon
1. Acesse: **https://neon.tech**
2. Clique em **"Sign Up"** ou **"Get Started"**
3. Faça login com GitHub (mais rápido) ou crie conta com email

### Passo 2: Criar Projeto
1. Após login, clique em **"Create a project"**
2. Preencha:
   - **Project name**: `senior-engineer-math` (ou qualquer nome)
   - **Region**: Escolha o mais próximo (ex: `US East`)
   - **PostgreSQL version**: Deixe o padrão (15 ou 16)
3. Clique em **"Create project"**

### Passo 3: Obter Connection String
1. No dashboard do projeto, você verá uma seção **"Connection Details"**
2. Procure por **"Connection string"** ou **"Connection URI"**
3. Clique em **"Copy"** para copiar a string completa
   - Formato: `postgresql://usuario:senha@host.neon.tech/database?sslmode=require`

### Passo 4: Configurar no Projeto
1. Abra o arquivo `.env` na raiz do projeto
2. Cole a connection string do Neon na linha `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql://usuario:senha@host.neon.tech/database?sslmode=require
   PORT=5000
   NODE_ENV=development
   ```
3. Salve o arquivo

### Passo 5: Criar Tabelas
Execute no terminal:
```bash
npm run db:push
```

Se der tudo certo, você verá:
```
✓ Schema pushed successfully
```

### Passo 6: Testar Localmente
```bash
npm run dev
```

A aplicação estará em: **http://localhost:5000**

---

## Parte 2: Deploy no GitHub Pages

### ⚠️ IMPORTANTE: Limitação do GitHub Pages

O **GitHub Pages serve apenas arquivos estáticos** (HTML, CSS, JS). Ele **NÃO** executa:
- ❌ Servidor Node.js/Express
- ❌ Backend/API
- ❌ Base de dados

### Soluções Possíveis:

#### Opção A: Deploy Full-Stack (Recomendado)
Use um serviço que suporte Node.js + PostgreSQL:

**Vercel (Gratuito e Fácil):**
1. Acesse: **https://vercel.com**
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Conecte seu repositório do GitHub
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (raiz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`
6. Adicione variáveis de ambiente:
   - `DATABASE_URL`: Cole a connection string do Neon
   - `NODE_ENV`: `production`
7. Clique em **"Deploy"**

**Railway (Alternativa):**
1. Acesse: **https://railway.app**
2. Faça login com GitHub
3. Clique em **"New Project"** → **"Deploy from GitHub repo"**
4. Selecione seu repositório
5. Adicione variável `DATABASE_URL` (ou use o PostgreSQL do Railway)

#### Opção B: Apenas Frontend no GitHub Pages
Se quiser usar GitHub Pages, você precisaria:
1. Separar frontend e backend
2. Deploy do frontend no GitHub Pages
3. Deploy do backend em outro serviço (Vercel, Railway, etc.)
4. Configurar CORS e URLs da API

---

## Passo a Passo: Deploy no Vercel (Recomendado)

### 1. Preparar o Projeto
Certifique-se de que o `.env` está configurado corretamente.

### 2. Fazer Push para GitHub
```bash
# Se ainda não fez commit
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 3. Deploy no Vercel
1. Acesse: **https://vercel.com**
2. **"Sign Up"** com GitHub
3. **"Add New Project"**
4. Importe seu repositório
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `.`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`
6. **Environment Variables**:
   - Clique em **"Environment Variables"**
   - Adicione:
     - `DATABASE_URL` = (sua connection string do Neon)
     - `NODE_ENV` = `production`
7. Clique em **"Deploy"**

### 4. Após Deploy
- O Vercel fornecerá uma URL (ex: `seu-projeto.vercel.app`)
- A aplicação estará online e funcionando!

### 5. Configurar Domínio Personalizado (Opcional)
No Vercel, você pode:
- Adicionar domínio personalizado
- Configurar DNS do GitHub Pages para apontar para Vercel

---

## Checklist Final

### Antes de Fazer Deploy:
- [ ] Neon configurado e funcionando
- [ ] `.env` com `DATABASE_URL` do Neon
- [ ] `npm run db:push` executado com sucesso
- [ ] `npm run dev` funciona localmente
- [ ] Código commitado no GitHub
- [ ] Variáveis de ambiente configuradas no serviço de deploy

### Após Deploy:
- [ ] Aplicação acessível online
- [ ] Cálculos funcionando
- [ ] Base de dados conectada
- [ ] Histórico funcionando

---

## Troubleshooting

### Erro: "DATABASE_URL must be set"
- Verifique se a variável está configurada no Vercel/Railway
- Certifique-se de que não há espaços extras na connection string

### Erro: "Connection timeout"
- Verifique se o Neon está ativo (pode hibernar após inatividade)
- Verifique se a connection string está correta

### Erro no Build
- Verifique se todas as dependências estão no `package.json`
- Verifique se o `build` script está correto

---

## Links Úteis

- **Neon**: https://neon.tech
- **Vercel**: https://vercel.com
- **Railway**: https://railway.app
- **GitHub Pages**: https://pages.github.com

