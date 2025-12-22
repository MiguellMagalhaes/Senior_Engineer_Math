# 🚀 Deploy no Vercel - Guia Completo

## Por que Vercel?

- ✅ **Gratuito** para projetos pessoais
- ✅ **Suporta Node.js/Express** (o que você precisa)
- ✅ **Deploy automático** do GitHub
- ✅ **Configuração simples**
- ✅ **SSL automático**
- ✅ **CDN global**

## Pré-requisitos

- ✅ Conta no Neon (já tem)
- ✅ Conta no GitHub (já tem)
- ✅ Código no GitHub (precisa fazer push)

---

## Passo a Passo

### 1️⃣ Fazer Push para GitHub

```bash
# Adicionar todos os arquivos
git add .

# Commit
git commit -m "Projeto completo com autenticação"

# Push (substitua 'main' pelo nome da sua branch)
git push origin main
```

### 2️⃣ Criar Conta no Vercel

1. Acesse: **https://vercel.com**
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios

### 3️⃣ Fazer Deploy

1. No dashboard do Vercel, clique em **"Add New Project"**
2. Selecione seu repositório `Senior_Engineer_Math`
3. Configure:

   **Build Settings:**
   - Framework Preset: **Vite** (deixar como detectado automaticamente)
   - Root Directory: **`.`** (raiz do projeto - deixar `./`)
   - Build Command: **`npm run build`** (deixar como está)
   - Output Directory: **`dist/public`** (deixar como está)
   - Install Command: **`npm install`** (deixar como está)
   
   **⚠️ IMPORTANTE:** Não altere essas configurações! O Vercel detectou automaticamente e está correto.

4. Clique em **"Environment Variables"** e adicione:

   ```
   DATABASE_URL = postgresql://neondb_owner:npg_6e1sQqyUaVAL@ep-steep-credit-agm1404k-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   NODE_ENV = production
   SESSION_SECRET = [gere uma chave aleatória - pode usar: openssl rand -base64 32]
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_USER = [seu email gmail]
   SMTP_PASS = [sua senha de app do gmail]
   APP_URL = https://[será preenchido após o deploy - veja abaixo]
   ```
   
   **⚠️ IMPORTANTE sobre APP_URL:**
   - Deixe em branco ou use um placeholder por enquanto
   - **Após o deploy**, o Vercel fornecerá uma URL como: `https://senior-engineer-math.vercel.app`
   - Volte nas variáveis de ambiente e atualize o `APP_URL` com essa URL real

5. Clique em **"Deploy"**

### 4️⃣ Após o Deploy

- O Vercel fornecerá uma **URL completa e funcional**, por exemplo:
  - `https://senior-engineer-math.vercel.app`
  - Esta é uma **URL real** que você pode usar e compartilhar!
  
- **Atualizar APP_URL:**
  1. Vá em **Settings** → **Environment Variables**
  2. Edite `APP_URL` e coloque a URL que o Vercel forneceu
  3. Faça um novo deploy (ou aguarde o próximo push)

- A aplicação estará online e acessível por essa URL!
- Cada push no GitHub fará deploy automático

**💡 Domínio Personalizado (Opcional):**
- Se você tem um domínio próprio (ex: `meusite.com`), pode configurá-lo no Vercel
- Vá em **Settings** → **Domains** e adicione seu domínio
- Mas o `.vercel.app` já funciona perfeitamente!

### 5️⃣ Configurar Tabelas no Banco

Após o primeiro deploy, você precisa criar as tabelas:

**Opção A: Via Terminal Local**
```bash
npm run db:push
npm run db:session
```

**Opção B: Via Vercel CLI** (mais fácil)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Executar comandos no ambiente do Vercel
vercel env pull .env.production
npm run db:push
npm run db:session
```

---

## Alternativas ao Vercel

### Railway (Gratuito)
- https://railway.app
- Similar ao Vercel
- Pode incluir PostgreSQL próprio (mas você já tem Neon)

### Render (Gratuito)
- https://render.com
- Suporta Node.js
- Plano gratuito com limitações

---

## ⚠️ IMPORTANTE: GitHub Pages NÃO Funciona

**GitHub Pages serve apenas arquivos estáticos.** Ele:
- ❌ Não executa Node.js
- ❌ Não pode servir sua API
- ❌ Não pode fazer autenticação server-side

**Solução:** Use Vercel (ou Railway/Render) para o projeto completo.

---

## Checklist Final

- [ ] Código no GitHub
- [ ] Conta no Vercel criada
- [ ] Projeto importado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Tabelas criadas no banco (db:push + db:session)
- [ ] Testado login/registro
- [ ] Testado cálculos

---

## Suporte

Se tiver problemas:
1. Verifique os logs no Vercel (Dashboard → Deployments → Logs)
2. Verifique se as variáveis de ambiente estão corretas
3. Verifique se as tabelas foram criadas no Neon

