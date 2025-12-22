# 🔧 Corrigir Erro: "Function Runtimes must have a valid version"

## 🐛 Erro
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```

## ✅ Solução

O problema é que o Vercel está detectando `api/index.ts` como função serverless, mas não está conseguindo determinar o runtime automaticamente.

### Opção 1: Remover Temporariamente a Pasta `api/` (Teste)

Para testar se o problema é com a função serverless:

1. **Renomeie temporariamente:**
   ```bash
   mv api api.backup
   ```

2. **Faça push:**
   ```bash
   git add .
   git commit -m "Test: Remover api temporariamente"
   git push origin main
   ```

3. **Teste se a página abre** (sem API, mas pelo menos não faz download)

4. **Se funcionar**, o problema é na configuração da função serverless

### Opção 2: Usar Estrutura Diferente

Em vez de `api/index.ts`, use uma estrutura mais simples:

1. **Mova o arquivo:**
   ```bash
   mkdir -p api/api
   mv api/index.ts api/api/index.ts
   ```

2. **Atualize `vercel.json`:**
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "/api/api"
       }
     ]
   }
   ```

### Opção 3: Configurar Runtime Explicitamente

Crie um arquivo `api/package.json`:

```json
{
  "type": "module"
}
```

E certifique-se de que o `api/index.ts` exporta corretamente:

```typescript
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ...
}
```

### Opção 4: Usar Estrutura de Build Diferente

Se nada funcionar, podemos mudar a estrutura para não usar função serverless:

1. **Remover pasta `api/`**
2. **Servir tudo como arquivos estáticos**
3. **Usar apenas frontend** (sem backend no Vercel)

---

## 🚀 Solução Recomendada

**Tente primeiro a Opção 1** para confirmar que o problema é com a função serverless.

Se funcionar sem a pasta `api/`, então sabemos que o problema é na configuração da função serverless e podemos ajustar.

---

## 📝 Nota

O Vercel detecta automaticamente funções serverless na pasta `api/`, mas às vezes precisa de configuração explícita. O erro sugere que está tentando usar um runtime antigo ou não reconhecido.

