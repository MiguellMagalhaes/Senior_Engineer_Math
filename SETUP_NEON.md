# 🎯 Setup Rápido: Neon PostgreSQL

## Passo a Passo Simplificado

### 1️⃣ Criar Conta no Neon
1. Vá para: **https://neon.tech**
2. Clique em **"Sign Up"** (use GitHub para login rápido)
3. Complete o cadastro

### 2️⃣ Criar Projeto
1. No dashboard, clique em **"Create a project"**
2. Nome do projeto: `senior-engineer-math`
3. Escolha a região mais próxima
4. Clique em **"Create project"**

### 3️⃣ Copiar Connection String
1. No dashboard do projeto, procure por **"Connection Details"**
2. Você verá algo como:
   ```
   postgresql://[user]:[password]@[host].neon.tech/[dbname]?sslmode=require
   ```
3. Clique no botão **"Copy"** ao lado da connection string

### 4️⃣ Configurar no Projeto
1. Abra o arquivo `.env` na raiz do projeto
2. Substitua a linha `DATABASE_URL` pela connection string que copiou:
   ```env
   DATABASE_URL=postgresql://[cole-aqui-a-string-completa-do-neon]
   PORT=5000
   NODE_ENV=development
   ```
3. **IMPORTANTE**: Mantenha o `?sslmode=require` no final da string!

### 5️⃣ Criar Tabelas
Execute no terminal:
```bash
npm run db:push
```

Você deve ver:
```
✓ Schema pushed successfully
```

### 6️⃣ Testar
```bash
npm run dev
```

Abra: **http://localhost:5000**

---

## ✅ Pronto!

Agora você pode testar a aplicação localmente. Quando estiver tudo funcionando, siga o guia `GUIA_NEON_GITHUB.md` para fazer deploy.

