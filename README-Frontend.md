# 🛒 E-Commerce Frontend

Frontend moderno para e-commerce desenvolvido com **React + TypeScript + Tailwind CSS**.

## 🚀 Funcionalidades

- ✅ **Interface Moderna** com Tailwind CSS
- ✅ **TypeScript** para type safety
- ✅ **Autenticação** completa (login/cadastro)
- ✅ **Catálogo de Produtos** com filtros e busca
- ✅ **Carrinho de Compras** interativo
- ✅ **Checkout** completo
- ✅ **Histórico de Pedidos**
- ✅ **Design Responsivo**
- ✅ **Notificações** com react-hot-toast

## 📋 Pré-requisitos

- Node.js 16+
- npm ou yarn
- Backend API rodando (main.py)

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar API
O frontend está configurado para conectar com a API em `http://localhost:8000`.
Certifique-se de que o backend está rodando.

### 3. Executar o Projeto
```bash
npm start
```

O projeto estará disponível em: http://localhost:3000

## 🎨 Tecnologias Utilizadas

- **React 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal
│   └── ProtectedRoute.tsx
├── contexts/           # Contextos React
│   ├── AuthContext.tsx # Autenticação
│   └── CartContext.tsx # Carrinho
├── pages/              # Páginas da aplicação
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── Orders.tsx
├── services/           # Serviços de API
│   └── api.ts
├── types/              # Definições TypeScript
│   └── index.ts
├── App.tsx             # Componente principal
├── index.tsx           # Ponto de entrada
└── index.css           # Estilos globais
```

## 🔧 Scripts Disponíveis

- `npm start` - Executa o projeto em modo desenvolvimento
- `npm build` - Cria build de produção
- `npm test` - Executa testes
- `npm eject` - Ejecta configurações do Create React App

## 🎯 Funcionalidades Detalhadas

### 🔐 Autenticação
- Login com username/senha
- Cadastro de novos usuários
- Proteção de rotas
- Gerenciamento de estado de autenticação

### 🛍️ Produtos
- Listagem de produtos com paginação
- Filtros por categoria
- Busca por nome/descrição
- Detalhes do produto
- Controle de estoque

### 🛒 Carrinho
- Adicionar/remover produtos
- Controle de quantidade
- Cálculo automático de totais
- Persistência no localStorage

### 📋 Pedidos
- Checkout completo
- Histórico de pedidos
- Status de entrega
- Detalhes do pedido

## 🎨 Design System

### Cores
- **Primary**: Azul (#3b82f6)
- **Secondary**: Cinza (#6b7280)
- **Success**: Verde (#10b981)
- **Warning**: Amarelo (#f59e0b)
- **Error**: Vermelho (#ef4444)

### Componentes
- Botões com estados (primary, secondary)
- Cards com sombras
- Inputs com validação
- Modais responsivos

## 🔗 Integração com Backend

O frontend se conecta com a API através dos seguintes endpoints:

- `POST /auth/login` - Login
- `POST /auth/register` - Cadastro
- `GET /products` - Listar produtos
- `GET /products/:id` - Detalhes do produto
- `POST /cart/add` - Adicionar ao carrinho
- `GET /cart` - Listar carrinho
- `DELETE /cart/:id` - Remover do carrinho
- `POST /orders/checkout` - Finalizar pedido
- `GET /orders` - Listar pedidos

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Servir Build Localmente
```bash
npx serve -s build
```

## 🐛 Solução de Problemas

### Erro de Conexão com API
- Verifique se o backend está rodando em `http://localhost:8000`
- Confirme se o CORS está configurado no backend

### Erro de Dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problemas de TypeScript
```bash
npm run build
```

## 📱 Responsividade

O design é totalmente responsivo e funciona em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🎉 Próximos Passos

- [ ] Implementar testes unitários
- [ ] Adicionar PWA capabilities
- [ ] Implementar dark mode
- [ ] Adicionar animações
- [ ] Implementar cache de dados
- [ ] Adicionar internacionalização

---

**Desenvolvido com ❤️ usando React + TypeScript + Tailwind CSS**


