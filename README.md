# 🛒 E-Commerce Backend API

API completa para e-commerce desenvolvida com **FastAPI** e **MySQL/XAMPP**, incluindo autenticação JWT, CRUD de produtos, carrinho de compras e sistema de pedidos.

##  Funcionalidades

- ✅ **Autenticação JWT** (login/cadastro)
- ✅ **CRUD de Produtos** e Categorias
- ✅ **Carrinho de Compras** (adicionar/remover/listar)
- ✅ **Sistema de Pedidos** (checkout completo)
- ✅ **Controle de Estoque**
- ✅ **Documentação Automática** (Swagger UI)

## 📋 Pré-requisitos

- Python 3.8+
- XAMPP (MySQL)
- pip

## 🛠️ Instalação e Configuração

### 1. Instalar XAMPP
- Baixe e instale o [XAMPP](https://www.apachefriends.org/)
- Inicie o MySQL no painel de controle do XAMPP
- Acesse http://localhost/phpmyadmin para gerenciar o banco

### 2. Configurar o Projeto
```bash
# Clone ou baixe o projeto
cd ecommerce-backend

# Instalar dependências
pip install -r requirements.txt
```

### 3. Configurar Banco de Dados
O script já está configurado para usar:
- **Host**: localhost
- **Porta**: 3306
- **Usuário**: root
- **Senha**: (vazia - padrão do XAMPP)
- **Banco**: ecommerce_db (criado automaticamente)

### 4. Executar a API
```bash
python main.py
```

A API estará disponível em:
- **API**: http://localhost:8000
- **Documentação**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📚 Endpoints da API

### 🔐 Autenticação
- `POST /auth/register` - Cadastrar usuário
- `POST /auth/login` - Fazer login

### 📦 Categorias
- `POST /categories` - Criar categoria (autenticado)
- `GET /categories` - Listar categorias

### 🛍️ Produtos
- `POST /products` - Criar produto (autenticado)
- `GET /products` - Listar produtos
- `GET /products/{id}` - Obter produto específico

### 🛒 Carrinho
- `POST /cart/add` - Adicionar ao carrinho (autenticado)
- `GET /cart` - Listar itens do carrinho (autenticado)
- `DELETE /cart/{id}` - Remover do carrinho (autenticado)

### 📋 Pedidos
- `POST /orders/checkout` - Finalizar pedido (autenticado)
- `GET /orders` - Listar pedidos do usuário (autenticado)

## 🔧 Exemplos de Uso

### 1. Cadastrar Usuário
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "joao",
    "email": "joao@email.com",
    "password": "senha123",
    "full_name": "João Silva"
  }'
```

### 2. Fazer Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "joao",
    "password": "senha123"
  }'
```

### 3. Criar Categoria
```bash
curl -X POST "http://localhost:8000/categories" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eletrônicos",
    "description": "Produtos eletrônicos"
  }'
```

### 4. Criar Produto
```bash
curl -X POST "http://localhost:8000/products" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "description": "Smartphone Android",
    "price": 999.99,
    "stock": 10,
    "category_id": 1,
    "image_url": "https://example.com/image.jpg"
  }'
```

### 5. Adicionar ao Carrinho
```bash
curl -X POST "http://localhost:8000/cart/add" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

### 6. Finalizar Pedido
```bash
curl -X POST "http://localhost:8000/orders/checkout" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": "Rua das Flores, 123",
    "payment_method": "credit_card"
  }'
```

## 🗄️ Estrutura do Banco de Dados

O script cria automaticamente as seguintes tabelas:

- **users** - Usuários do sistema
- **categories** - Categorias de produtos
- **products** - Produtos
- **cart_items** - Itens do carrinho
- **orders** - Pedidos
- **order_items** - Itens dos pedidos

## 🔒 Segurança

- Senhas são criptografadas com bcrypt
- Tokens JWT para autenticação
- Validação de dados com Pydantic
- Controle de estoque automático

## 🐛 Solução de Problemas

### Erro de Conexão com MySQL
- Verifique se o XAMPP está rodando
- Confirme se o MySQL está ativo no painel do XAMPP
- Teste a conexão em http://localhost/phpmyadmin

### Erro de Dependências
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### Porta 8000 em Uso
```bash
# Alterar porta no final do arquivo main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

## 📖 Documentação Interativa

Acesse http://localhost:8000/docs para ver a documentação interativa da API com Swagger UI, onde você pode testar todos os endpoints diretamente no navegador.

## 🎯 Próximos Passos

- [ ] Implementar upload de imagens
- [ ] Adicionar sistema de avaliações
- [ ] Implementar cupons de desconto
- [ ] Adicionar relatórios de vendas
- [ ] Implementar notificações por email

## 📤 Publicar no GitHub

Para publicar este projeto no GitHub, consulte:
- **[LEIA-ME-GITHUB.md](LEIA-ME-GITHUB.md)** - Guia completo passo a passo
- **[COMO-SUBIR-GITHUB.txt](COMO-SUBIR-GITHUB.txt)** - Versão rápida em texto
- **[GITHUB-SETUP.md](GITHUB-SETUP.md)** - Instruções detalhadas

**Resumo rápido:**
```bash
git init
git add .
git commit -m "Primeira versão do projeto E-Commerce"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

**Desenvolvido com usando FastAPI + MySQL**

