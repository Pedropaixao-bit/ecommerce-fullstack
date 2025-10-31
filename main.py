"""
E-Commerce Backend API
FastAPI + MySQL/XAMPP
Autor: Assistente IA
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import mysql.connector
from mysql.connector import Error
from typing import List, Optional
import os
from decimal import Decimal

# Configurações
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configurações do banco de dados MySQL/XAMPP
DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '',  # Senha padrão do XAMPP é vazia
    'database': 'ecommerce_db',
    'charset': 'utf8mb4'
}

# Inicialização do FastAPI
app = FastAPI(
    title="E-Commerce API",
    description="API completa para e-commerce com FastAPI e MySQL",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração de segurança
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Modelos Pydantic
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class Category(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime

class ProductCreate(BaseModel):
    name: str
    description: str
    price: Decimal
    stock: int
    category_id: int
    image_url: Optional[str] = None

class Product(BaseModel):
    id: int
    name: str
    description: str
    price: Decimal
    stock: int
    category_id: int
    image_url: Optional[str]
    created_at: datetime

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int

class CartItem(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    product_name: str
    product_price: Decimal
    total_price: Decimal

class OrderCreate(BaseModel):
    shipping_address: str
    payment_method: str

class OrderItem(BaseModel):
    product_id: int
    quantity: int
    price: Decimal

class Order(BaseModel):
    id: int
    user_id: int
    total_amount: Decimal
    shipping_address: str
    payment_method: str
    status: str
    created_at: datetime
    items: List[OrderItem]

# Funções de banco de dados
def get_db_connection():
    """Cria conexão com o banco de dados MySQL"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Erro ao conectar com MySQL: {e}")
        return None

def init_database():
    """Inicializa o banco de dados e cria as tabelas"""
    connection = get_db_connection()
    if not connection:
        return False
    
    try:
        cursor = connection.cursor()
        
        # Criar banco de dados se não existir
        cursor.execute("CREATE DATABASE IF NOT EXISTS ecommerce_db")
        cursor.execute("USE ecommerce_db")
        
        # Criar tabelas
        tables = [
            """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                stock INT NOT NULL DEFAULT 0,
                category_id INT,
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS cart_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (product_id) REFERENCES products(id),
                UNIQUE KEY unique_user_product (user_id, product_id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                shipping_address TEXT NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
            """
        ]
        
        for table in tables:
            cursor.execute(table)
        
        connection.commit()
        print("Banco de dados inicializado com sucesso!")
        return True
        
    except Error as e:
        print(f"Erro ao inicializar banco de dados: {e}")
        return False
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Funções de autenticação
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        if user is None:
            raise credentials_exception
        return User(**user)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Endpoints de autenticação
@app.post("/auth/register", response_model=User)
async def register_user(user: UserCreate):
    """Registra um novo usuário"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor()
        
        # Verificar se usuário já existe
        cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", 
                      (user.username, user.email))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username or email already registered")
        
        # Criar usuário
        password_hash = get_password_hash(user.password)
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, full_name)
            VALUES (%s, %s, %s, %s)
        """, (user.username, user.email, password_hash, user.full_name))
        
        connection.commit()
        user_id = cursor.lastrowid
        
        # Retornar dados do usuário (sem senha)
        cursor.execute("SELECT id, username, email, full_name, is_active FROM users WHERE id = %s", (user_id,))
        user_data = cursor.fetchone()
        
        return User(**user_data)
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.post("/auth/login", response_model=Token)
async def login_user(user: UserLogin):
    """Faz login do usuário"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (user.username,))
        db_user = cursor.fetchone()
        
        if not db_user or not verify_password(user.password, db_user['password_hash']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user['username']}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Endpoints de categorias
@app.post("/categories", response_model=Category)
async def create_category(category: CategoryCreate, current_user: User = Depends(get_current_user)):
    """Cria uma nova categoria"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO categories (name, description)
            VALUES (%s, %s)
        """, (category.name, category.description))
        
        connection.commit()
        category_id = cursor.lastrowid
        
        cursor.execute("SELECT * FROM categories WHERE id = %s", (category_id,))
        category_data = cursor.fetchone()
        
        return Category(**category_data)
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/categories", response_model=List[Category])
async def get_categories():
    """Lista todas as categorias"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM categories ORDER BY name")
        categories = cursor.fetchall()
        
        return [Category(**cat) for cat in categories]
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Endpoints de produtos
@app.post("/products", response_model=Product)
async def create_product(product: ProductCreate, current_user: User = Depends(get_current_user)):
    """Cria um novo produto"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO products (name, description, price, stock, category_id, image_url)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (product.name, product.description, product.price, product.stock, 
              product.category_id, product.image_url))
        
        connection.commit()
        product_id = cursor.lastrowid
        
        cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
        product_data = cursor.fetchone()
        
        return Product(**product_data)
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/products", response_model=List[Product])
async def get_products(category_id: Optional[int] = None):
    """Lista produtos, opcionalmente filtrados por categoria"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        if category_id:
            cursor.execute("SELECT * FROM products WHERE category_id = %s ORDER BY name", (category_id,))
        else:
            cursor.execute("SELECT * FROM products ORDER BY name")
        
        products = cursor.fetchall()
        return [Product(**prod) for prod in products]
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """Obtém um produto específico"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
        product = cursor.fetchone()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return Product(**product)
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Endpoints do carrinho
@app.post("/cart/add", response_model=CartItem)
async def add_to_cart(item: CartItemCreate, current_user: User = Depends(get_current_user)):
    """Adiciona item ao carrinho"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor()
        
        # Verificar se produto existe e tem estoque
        cursor.execute("SELECT stock FROM products WHERE id = %s", (item.product_id,))
        product = cursor.fetchone()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if product[0] < item.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        
        # Verificar se item já está no carrinho
        cursor.execute("""
            SELECT id, quantity FROM cart_items 
            WHERE user_id = %s AND product_id = %s
        """, (current_user.id, item.product_id))
        
        existing_item = cursor.fetchone()
        
        if existing_item:
            # Atualizar quantidade
            new_quantity = existing_item[1] + item.quantity
            cursor.execute("""
                UPDATE cart_items SET quantity = %s WHERE id = %s
            """, (new_quantity, existing_item[0]))
            cart_item_id = existing_item[0]
        else:
            # Adicionar novo item
            cursor.execute("""
                INSERT INTO cart_items (user_id, product_id, quantity)
                VALUES (%s, %s, %s)
            """, (current_user.id, item.product_id, item.quantity))
            cart_item_id = cursor.lastrowid
        
        connection.commit()
        
        # Retornar dados completos do item
        cursor.execute("""
            SELECT ci.id, ci.user_id, ci.product_id, ci.quantity,
                   p.name as product_name, p.price as product_price,
                   (ci.quantity * p.price) as total_price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.id = %s
        """, (cart_item_id,))
        
        cart_item_data = cursor.fetchone()
        return CartItem(**cart_item_data)
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/cart", response_model=List[CartItem])
async def get_cart(current_user: User = Depends(get_current_user)):
    """Lista itens do carrinho do usuário"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT ci.id, ci.user_id, ci.product_id, ci.quantity,
                   p.name as product_name, p.price as product_price,
                   (ci.quantity * p.price) as total_price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = %s
            ORDER BY ci.created_at DESC
        """, (current_user.id,))
        
        cart_items = cursor.fetchall()
        return [CartItem(**item) for item in cart_items]
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.delete("/cart/{item_id}")
async def remove_from_cart(item_id: int, current_user: User = Depends(get_current_user)):
    """Remove item do carrinho"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor()
        cursor.execute("""
            DELETE FROM cart_items WHERE id = %s AND user_id = %s
        """, (item_id, current_user.id))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        connection.commit()
        return {"message": "Item removed from cart"}
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Endpoints de pedidos
@app.post("/orders/checkout", response_model=Order)
async def checkout_order(order_data: OrderCreate, current_user: User = Depends(get_current_user)):
    """Finaliza pedido e cria ordem"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor()
        
        # Obter itens do carrinho
        cursor.execute("""
            SELECT ci.product_id, ci.quantity, p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = %s
        """, (current_user.id,))
        
        cart_items = cursor.fetchall()
        
        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        # Calcular total
        total_amount = sum(item[1] * item[2] for item in cart_items)
        
        # Criar pedido
        cursor.execute("""
            INSERT INTO orders (user_id, total_amount, shipping_address, payment_method)
            VALUES (%s, %s, %s, %s)
        """, (current_user.id, total_amount, order_data.shipping_address, order_data.payment_method))
        
        order_id = cursor.lastrowid
        
        # Criar itens do pedido e atualizar estoque
        for product_id, quantity, price in cart_items:
            cursor.execute("""
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (%s, %s, %s, %s)
            """, (order_id, product_id, quantity, price))
            
            # Atualizar estoque
            cursor.execute("""
                UPDATE products SET stock = stock - %s WHERE id = %s
            """, (quantity, product_id))
        
        # Limpar carrinho
        cursor.execute("DELETE FROM cart_items WHERE user_id = %s", (current_user.id,))
        
        connection.commit()
        
        # Retornar dados do pedido
        cursor.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
        order = cursor.fetchone()
        
        cursor.execute("""
            SELECT product_id, quantity, price FROM order_items WHERE order_id = %s
        """, (order_id,))
        order_items = cursor.fetchall()
        
        order_data = {
            'id': order[0],
            'user_id': order[1],
            'total_amount': order[2],
            'shipping_address': order[3],
            'payment_method': order[4],
            'status': order[5],
            'created_at': order[6],
            'items': [OrderItem(product_id=item[0], quantity=item[1], price=item[2]) for item in order_items]
        }
        
        return Order(**order_data)
        
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/orders", response_model=List[Order])
async def get_user_orders(current_user: User = Depends(get_current_user)):
    """Lista pedidos do usuário"""
    connection = get_db_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM orders WHERE user_id = %s ORDER BY created_at DESC
        """, (current_user.id,))
        
        orders = cursor.fetchall()
        
        result = []
        for order in orders:
            cursor.execute("""
                SELECT product_id, quantity, price FROM order_items WHERE order_id = %s
            """, (order['id'],))
            order_items = cursor.fetchall()
            
            order['items'] = [OrderItem(**item) for item in order_items]
            result.append(Order(**order))
        
        return result
        
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Endpoint de inicialização
@app.on_event("startup")
async def startup_event():
    """Inicializa o banco de dados na startup"""
    print("Inicializando banco de dados...")
    if init_database():
        print(" Banco de dados inicializado com sucesso!")
    else:
        print(" Erro ao inicializar banco de dados")

# Endpoint de saúde
@app.get("/health")
async def health_check():
    """Verifica se a API está funcionando"""
    return {"status": "healthy", "message": "E-Commerce API is running"}

# Endpoint raiz
@app.get("/")
async def root():
    """Endpoint raiz com informações da API"""
    return {
        "message": "E-Commerce API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando servidor E-Commerce API...")
    print("📖 Documentação disponível em: http://localhost:8000/docs")
    print("🔍 Health check em: http://localhost:8000/health")
    uvicorn.run(app, host="0.0.0.0", port=8000)
