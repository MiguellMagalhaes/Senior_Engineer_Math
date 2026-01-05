# 🚀 Deploy no GitHub Pages - Guia Completo

## ⚠️ IMPORTANTE: Habilitar GitHub Pages Primeiro!

**Antes de fazer push**, você precisa habilitar o GitHub Pages nas configurações do repositório.

---

## 📋 Passo a Passo Completo

### 1️⃣ Habilitar GitHub Pages (OBRIGATÓRIO)

1. Vá ao seu repositório no GitHub
2. Clique em **Settings** (Configurações) - no topo do repositório
3. No menu lateral esquerdo, clique em **Pages**
4. Em **Source**, selecione:
   - **Source**: `Deploy from a branch` (deixe assim por enquanto)
   - **Branch**: `main`
   - **Folder**: `/ (root)` ou `/docs` (não importa, vamos mudar depois)
5. Clique em **Save**

6. **AGORA MUDE PARA GITHUB ACTIONS:**
   - Volte em **Pages**
   - Em **Source**, mude para: **GitHub Actions**
   - Clique em **Save**

✅ **Pronto!** Agora o GitHub Pages está habilitado e configurado para usar GitHub Actions.

---

### 2️⃣ Fazer Push do Código

```bash
git add .
git commit -m "Configurar GitHub Pages"
git push origin main
```

---

### 3️⃣ Aguardar Deploy Automático

- O GitHub Actions irá fazer o build automaticamente
- Aguarde 2-3 minutos
- Vá em **Actions** no seu repositório para ver o progresso

---

### 4️⃣ Acessar o Site

Após o deploy bem-sucedido, o site estará disponível em:
```
https://MiguellMagalhaes.github.io/Senior_Engineer_Math/
```

(Substitua `MiguellMagalhaes` pelo seu nome de usuário do GitHub)

---

## 🔧 Se Ainda Der Erro

### Erro: "Get Pages site failed"

**Solução:**
1. Vá em **Settings** → **Pages**
2. Certifique-se de que está selecionado: **GitHub Actions** (não "Deploy from a branch")
3. Se não aparecer a opção "GitHub Actions", você precisa:
   - Primeiro selecionar "Deploy from a branch" e salvar
   - Depois mudar para "GitHub Actions" e salvar novamente

### Erro no Build

1. Verifique os logs em **Actions** → **Latest workflow run**
2. Veja qual passo falhou
3. Verifique se todas as dependências estão no `package.json`

---

## 📝 Método Alternativo (Manual)

Se o GitHub Actions não funcionar, você pode fazer deploy manual:

### 1. Build Local

```bash
npm run build
```

### 2. Configurar GitHub Pages

1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione:
   - **Branch**: `main`
   - **Folder**: `/dist/public`
3. Clique em **Save**

### 3. Fazer Push da Pasta dist

```bash
# Adicionar dist/public ao git (se não estiver no .gitignore)
git add dist/public
git commit -m "Add build files"
git push origin main
```

---

## ✅ Checklist

Antes de fazer push, verifique:

- [ ] GitHub Pages está habilitado em **Settings** → **Pages**
- [ ] **Source** está configurado como **GitHub Actions**
- [ ] O workflow `.github/workflows/deploy.yml` existe
- [ ] O `package.json` tem o script `build`
- [ ] O `vite.config.ts` está configurado corretamente

---

## 🎯 Resumo Rápido

1. **Settings** → **Pages** → **GitHub Actions** → **Save**
2. `git push origin main`
3. Aguardar 2-3 minutos
4. Acessar: `https://SEU_USUARIO.github.io/Senior_Engineer_Math/`

---

## 🐛 Problemas Comuns

### "HttpError: Not Found"
- **Causa**: GitHub Pages não está habilitado
- **Solução**: Siga o passo 1 acima (habilitar GitHub Pages)

### "Get Pages site failed"
- **Causa**: GitHub Pages não está configurado para GitHub Actions
- **Solução**: Mude o Source para "GitHub Actions" em Settings → Pages

### Site não carrega (404)
- **Causa**: Base path incorreto
- **Solução**: Verifique se o `vite.config.ts` tem `base: process.env.GITHUB_PAGES_BASE || "/"`

---

## ✅ Pronto!

Seu projeto está simplificado e pronto para GitHub Pages! 🎉
