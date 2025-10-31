# Script para configurar e publicar projeto no GitHub
# Execute: .\setup-github.ps1

Write-Host "Configurando Projeto E-Commerce para GitHub" -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
if (-Not (Test-Path "main.py")) {
    Write-Host "Erro: Certifique-se de que esta na pasta raiz do projeto!" -ForegroundColor Red
    exit
}

Write-Host "Projeto encontrado!" -ForegroundColor Green
Write-Host ""

# Verificar se Git está instalado
try {
    $gitVersion = git --version 2>$null
    Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git nao encontrado." -ForegroundColor Yellow
    Write-Host "Por favor, instale o Git de: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

Write-Host ""

# Verificar se já é um repositório Git
if (Test-Path ".git") {
    Write-Host "Repositorio Git ja inicializado" -ForegroundColor Blue
} else {
    Write-Host "Inicializando repositorio Git..." -ForegroundColor Cyan
    git init
    Write-Host "Repositorio inicializado!" -ForegroundColor Green
}

Write-Host ""

# Adicionar arquivos
Write-Host "Adicionando arquivos..." -ForegroundColor Cyan
git add .

# Verificar se há mudanças para commitar
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "Nenhuma mudanca para commitar" -ForegroundColor Yellow
} else {
    Write-Host "Fazendo commit inicial..." -ForegroundColor Cyan
    git commit -m "Primeira versao do projeto E-Commerce"
    Write-Host "Commit realizado!" -ForegroundColor Green
}

Write-Host ""

# Informações sobre o próximo passo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Crie um repositorio no GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Execute os seguintes comandos:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Consulte o arquivo GITHUB-SETUP.md para instrucoes detalhadas" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Configuracao concluida!" -ForegroundColor Green

