# 📤 Como Subir seu Projeto para o GitHub

## ⚠️ IMPORTANTE - Leia Primeiro!

Olá! Eu preparei tudo para você publicar seu projeto E-Commerce no GitHub. Siga este guia passo a passo.

## 📁 Arquivos Criados Para Você

✅ `.gitignore` - Configuração para ignorar arquivos desnecessários  
✅ `COMO-SUBIR-GITHUB.txt` - Guia rápido em texto  
✅ `GITHUB-SETUP.md` - Guia completo com detalhes  
✅ `setup-github.ps1` - Script automático (opcional)

---

## 🚀 Método Rápido (Recomendado)

### 1️⃣ Abra o Git Bash ou PowerShell

**No Windows Explorer:**
- Clique com o botão direito na pasta `E-COMMERCE`
- Escolha **"Git Bash Here"** ou **"Abrir no Terminal"**

### 2️⃣ Execute Estes Comandos (Copie e Cole)

```bash
# Inicializar Git
git init

# Configurar seu nome (substitua com seu nome)
git config --global user.name "Pedro Paixão"

# Configurar seu email (substitua com seu email)
git config --global user.email "seu-email@gmail.com"

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Primeira versão do projeto E-Commerce"
```

### 3️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Digite um nome: `ecommerce-fullstack` (ou outro)
3. **NÃO marque** "Initialize this repository"
4. Clique em **"Create repository"**

### 4️⃣ Conectar e Enviar

No terminal, execute (substitua `SEU_USUARIO` e `SEU_REPOSITORIO`):

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### 5️⃣ Autenticar

Quando pedir login:
- **Usuário:** Seu usuário do GitHub
- **Senha:** Use um **Personal Access Token** (veja abaixo)

---

## 🔐 Como Criar Personal Access Token

1. Vá para: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Nome: `Meu Computador`
4. Selecione: **`repo`** ✅
5. Clique em **"Generate token"**
6. **COPIE** o token (ex: `ghp_xxxxxxxxxxxxx`)
7. Cole quando pedir senha no terminal

---

## 📝 Método Automático (Script)

Se preferir, execute o script:

```powershell
.\setup-github.ps1
```

---

## ✅ Verificar

Após o push, acesse seu repositório no GitHub. Deve aparecer todos os arquivos!

---

## 🐛 Problemas?

### Git não encontrado

Se aparecer "git não é reconhecido":
1. Reinicie o computador (o Git foi instalado)
2. Ou baixe manualmente: https://git-scm.com/download/win

### Erro de autenticação

Use o Personal Access Token, não sua senha do GitHub!

### "Updates were rejected"

```bash
git pull origin main --rebase
git push
```

---

## 📚 Comandos Úteis

```bash
# Ver status dos arquivos
git status

# Ver histórico
git log

# Atualizar repositório
git add .
git commit -m "Mensagem"
git push
```

---

## 🎉 Pronto!

Seu projeto E-Commerce está no GitHub! Compartilhe com orgulho! 🚀

---

## 📖 Documentação

- [Git Oficial](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/pt)
- [Git Tutorial](https://www.atlassian.com/git/tutorials)

---

**Desenvolvido com ❤️ para ajudar você a publicar seu projeto!**

