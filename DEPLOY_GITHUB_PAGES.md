# 🚀 Deploy no GitHub Pages - Guia Simples

## ✅ Pré-requisitos

- ✅ Conta no GitHub
- ✅ Repositório criado
- ✅ Código commitado

---

## 📋 Passo a Passo

### 1️⃣ Ativar GitHub Pages

1. Vá ao seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source**, selecione:
   - **Source**: `GitHub Actions`
5. Clique em **Save**

### 2️⃣ Fazer Push do Código

```bash
git add .
git commit -m "Simplificar projeto para GitHub Pages"
git push origin main
```

### 3️⃣ Aguardar Deploy Automático

- O GitHub Actions irá fazer o build automaticamente
- Aguarde 2-3 minutos
- Vá em **Actions** no seu repositório para ver o progresso

### 4️⃣ Acessar o Site

Após o deploy, o site estará disponível em:
```
https://SEU_USUARIO.github.io/Senior_Engineer_Math/
```

---

## 🔧 Configuração Manual (Alternativa)

Se preferir fazer deploy manual:

### 1. Build Local

```bash
npm run build
```

### 2. Configurar GitHub Pages

1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione:
   - **Branch**: `main` (ou `gh-pages`)
   - **Folder**: `/dist/public`
3. Clique em **Save**

### 3. Fazer Push

```bash
# Criar branch gh-pages (opcional)
git checkout -b gh-pages
git add dist/public
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

---

## 📝 Notas

- ✅ O projeto agora é **100% frontend** (sem backend)
- ✅ Histórico de cálculos é salvo no **localStorage** do navegador
- ✅ Funciona offline após o primeiro carregamento
- ✅ Não precisa de banco de dados ou servidor

---

## 🐛 Problemas Comuns

### Site não carrega

1. Verifique se o GitHub Actions completou com sucesso
2. Verifique se a branch está correta
3. Aguarde alguns minutos (pode demorar)

### Rotas não funcionam (404)

- O GitHub Pages já está configurado para SPA routing
- Se ainda não funcionar, verifique o `base` no `vite.config.ts`

---

## ✅ Pronto!

Seu projeto está simplificado e pronto para GitHub Pages! 🎉

