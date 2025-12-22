# ✅ Como Verificar se o Deploy Está Funcionando

## 🎯 Status Atual
- ✅ **Deploy concluído com sucesso!**
- ✅ **URLs disponíveis:**
  - `https://seniorengineermath.vercel.app` (principal)
  - `https://seniorengineermath-git-main-miguel-magalhaes-projects-1c2f7244.vercel.app` (preview)

---

## 📋 Checklist de Verificação

### 1️⃣ Testar a Página Principal

**Abra no navegador:**
```
https://seniorengineermath.vercel.app
```

**O que verificar:**
- [ ] A página carrega sem erros
- [ ] Não aparece tela branca
- [ ] A interface aparece corretamente
- [ ] Não há erros no console do navegador (F12 → Console)

**Se aparecer erro:**
- Verifique os logs no Vercel (Runtime Logs)
- Verifique se as variáveis de ambiente estão corretas

---

### 2️⃣ Criar as Tabelas no Banco de Dados

**⚠️ IMPORTANTE:** Antes de testar login/registro, você precisa criar as tabelas!

**Execute no terminal local:**

```bash
# Garantir que está no diretório do projeto
cd /Users/miguelmagalhaes/Documents/GitHub/Senior_Engineer_Math

# Criar tabelas users e calculations
npm run db:push

# Criar tabela session (para autenticação)
npm run db:session
```

**Verificar se funcionou:**
- [ ] Não aparecem erros
- [ ] Mensagem de sucesso aparece

**Se der erro:**
- Verifique se o `DATABASE_URL` no `.env` local está correto
- Verifique se o Neon está acessível

---

### 3️⃣ Testar Registro de Usuário

**No navegador (https://seniorengineermath.vercel.app):**

1. Clique em **"Registrar"** ou **"Criar Conta"**
2. Preencha:
   - Email: `teste@exemplo.com`
   - Nome: `Teste`
   - Senha: `123456`
3. Clique em **"Criar Conta"**

**O que verificar:**
- [ ] Conta é criada com sucesso
- [ ] Você é redirecionado para a página principal
- [ ] Não aparece erro "Email já está em uso" (na primeira vez)

**Se der erro:**
- Verifique os logs no Vercel (Runtime Logs)
- Verifique se as tabelas foram criadas (passo 2)
- Verifique se `DATABASE_URL` está correto no Vercel

---

### 4️⃣ Testar Login

**No navegador:**

1. Se não estiver logado, clique em **"Login"**
2. Preencha:
   - Email: `teste@exemplo.com`
   - Senha: `123456`
3. Clique em **"Entrar"**

**O que verificar:**
- [ ] Login funciona
- [ ] Você é redirecionado para a página principal
- [ ] Seu nome aparece na interface
- [ ] Não aparece erro de autenticação

**Se der erro:**
- Verifique se a conta foi criada (passo 3)
- Verifique os logs no Vercel
- Verifique se `SESSION_SECRET` está configurado no Vercel

---

### 5️⃣ Testar Primeiro Login (Curso e Ano)

**Após criar conta ou fazer login pela primeira vez:**

1. Deve aparecer um formulário pedindo:
   - **Curso:** (ex: "Engenharia Informática")
   - **Ano:** (ex: 1, 2, 3...)
2. Preencha e clique em **"Salvar"**

**O que verificar:**
- [ ] Formulário aparece
- [ ] Dados são salvos
- [ ] Você é redirecionado para a página principal
- [ ] Não aparece mais o formulário em logins futuros

---

### 6️⃣ Testar Cálculo de Integral

**No navegador (logado):**

1. Na página principal, preencha:
   - **Função:** `100 + 20*t`
   - **t1:** `0`
   - **t2:** `10`
2. Clique em **"Calcular"**

**O que verificar:**
- [ ] Cálculo é executado
- [ ] Resultado aparece
- [ ] Não há erros
- [ ] O cálculo aparece no histórico

---

### 7️⃣ Testar API Diretamente

**Teste a API com curl ou Postman:**

```bash
# Testar endpoint de saúde (se existir)
curl https://seniorengineermath.vercel.app/api/calculations

# Testar registro
curl -X POST https://seniorengineermath.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste2@exemplo.com","password":"123456","name":"Teste 2"}'
```

**O que verificar:**
- [ ] API responde (não dá 404 ou 500)
- [ ] Respostas são em JSON
- [ ] Não há erros de CORS

---

### 8️⃣ Verificar Logs no Vercel

**No dashboard do Vercel:**

1. Clique no deployment
2. Vá em **"Runtime Logs"**
3. Verifique se há erros

**O que procurar:**
- ❌ Erros de conexão com banco
- ❌ Erros de autenticação
- ❌ Erros 500 (Internal Server Error)
- ✅ Requisições 200 (sucesso)

---

## 🐛 Problemas Comuns e Soluções

### ❌ "Página em branco"
**Solução:**
- Verifique o console do navegador (F12)
- Verifique os logs no Vercel
- Verifique se o build foi bem-sucedido

### ❌ "Erro ao criar conta"
**Solução:**
- Verifique se as tabelas foram criadas (`npm run db:push`)
- Verifique se `DATABASE_URL` está correto no Vercel
- Verifique os logs no Vercel

### ❌ "Erro de autenticação"
**Solução:**
- Verifique se `SESSION_SECRET` está configurado no Vercel
- Verifique se a tabela `session` foi criada (`npm run db:session`)
- Verifique os logs no Vercel

### ❌ "Erro 500"
**Solução:**
- Verifique os logs no Vercel (Runtime Logs)
- Verifique todas as variáveis de ambiente
- Verifique se o banco está acessível

### ❌ "CORS error"
**Solução:**
- Verifique se `APP_URL` está correto no Vercel
- Verifique se o frontend está fazendo requisições para a URL correta

---

## ✅ Checklist Final

- [ ] Página principal carrega
- [ ] Tabelas criadas no banco
- [ ] Registro funciona
- [ ] Login funciona
- [ ] Formulário de curso/ano aparece
- [ ] Cálculo de integral funciona
- [ ] Histórico aparece
- [ ] Estatísticas aparecem
- [ ] Sem erros nos logs

---

## 🎉 Se Tudo Funcionar

**Parabéns!** Sua aplicação está online e funcionando!

**Próximos passos:**
- Compartilhe a URL: `https://seniorengineermath.vercel.app`
- Cada push no GitHub fará deploy automático
- Monitore os logs periodicamente

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:
1. Verifique os logs no Vercel
2. Verifique o console do navegador (F12)
3. Verifique se todas as variáveis de ambiente estão corretas
4. Verifique se as tabelas foram criadas

