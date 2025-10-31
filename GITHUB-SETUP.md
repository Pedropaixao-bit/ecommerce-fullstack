# 🚀 Como Subir seu Projeto E-Commerce para o GitHub

Este guia vai te ajudar a publicar seu projeto no GitHub em poucos passos.

## 📋 Pré-requisitos

1. **Conta no GitHub**: Se ainda não tem, crie em [github.com](https://github.com)
2. **Git instalado**: Já foi instalado automaticamente ✅

## 🔧 Passo a Passo

### 1. Inicializar o Git no seu projeto

Abra o **PowerShell** ou **Git Bash** na pasta do projeto e execute:

```bash
cd "C:\Users\PedroPaixão\Documents\CODS\E-COMMERCE"
git init
```

### 2. Configurar o Git (apenas na primeira vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

### 3. Adicionar todos os arquivos

```bash
git add .
```

### 4. Fazer o primeiro commit

```bash
git commit -m "Primeira versão do projeto E-Commerce"
```

### 5. Criar repositório no GitHub

1. Vá para [github.com/new](https://github.com/new)
2. Escolha um nome para o repositório (ex: `ecommerce-fullstack`)
3. **NÃO** marque "Initialize this repository with a README"
4. Clique em "Create repository"

### 6. Conectar ao GitHub

Copie a URL do seu repositório (exemplo: `https://github.com/seu-usuario/ecommerce-fullstack.git`) e execute:

```bash
git remote add origin https://github.com/seu-usuario/ecommerce-fullstack.git
git branch -M main
git push -u origin main
```

**Nota**: Você precisará fazer login no GitHub quando solicitado.

## 🔐 Autenticação GitHub

Na primeira vez que fizer push, o GitHub pode pedir credenciais:

- **Usuário**: Seu nome de usuário do GitHub
- **Senha**: Use um **Personal Access Token** (não sua senha)

### Como criar um Personal Access Token:

1. Vá para [github.com/settings/tokens](https://github.com/settings/tokens)
2. Clique em "Generate new token" > "Generate new token (classic)"
3. Dê um nome (ex: "Meu Computador")
4. Selecione o escopo **`repo`** (todos os direitos)
5. Clique em "Generate token"
6. **COPIE** o token (você não verá novamente!)
7. Use este token como senha ao fazer push

## ✅ Verificação

Depois de fazer push, acesse seu repositório no GitHub. Você deve ver todos os arquivos lá!

## 🔄 Como Atualizar no Futuro

Sempre que fizer mudanças, use:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

## 📚 Comandos Úteis

```bash
# Ver status dos arquivos
git status

# Ver histórico de commits
git log

# Desfazer mudanças não commitadas
git checkout .

# Renomear arquivo
git mv arquivo_antigo.txt arquivo_novo.txt
```

## 🐛 Problemas Comuns

### Erro: "fatal: not a git repository"
```bash
# Você não está na pasta certa, volte para:
cd "C:\Users\PedroPaixão\Documents\CODS\E-COMMERCE"
```

### Erro: "Authentication failed"
- Verifique se está usando o Personal Access Token correto
- Não use sua senha do GitHub

### Erro: "Updates were rejected"
```bash
git pull origin main --rebase
git push
```

## 📝 Estrutura do Projeto

Seu projeto está pronto com:
- ✅ `.gitignore` configurado para ignorar arquivos desnecessários
- ✅ Backend Python/FastAPI
- ✅ Frontend React/TypeScript
- ✅ Documentação completa

## 🎯 Próximos Passos

Após publicar no GitHub, você pode:

1. Adicionar **badges** no README
2. Configurar **GitHub Actions** para CI/CD
3. Adicionar **issues** para organizar tarefas
4. Criar **branches** para novas features
5. Fazer **pull requests** para revisar código

---

**Precisa de ajuda?** Consulte a [documentação oficial do Git](https://git-scm.com/doc) ou [GitHub Docs](https://docs.github.com/pt)

