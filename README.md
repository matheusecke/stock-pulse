# StockPulse

Sistema de gerenciamento de estoque desenvolvido como projeto de Computação em Nuvem. Aplicação web completa para controle de produtos e estoque.

## 📋 Tecnologias

- **Frontend:** Vue.js 3 + Vite + TypeScript + Tailwind CSS
- **Backend:** NestJS + Prisma
- **Banco de Dados:** MySQL 8.0
- **Containerização:** Docker + Docker Compose
- **CI/CD:** GitHub Actions

## 🚀 Como Executar

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

### Iniciar a Aplicação

1. **Clone o repositório e acesse a pasta:**

```bash
git clone <url-do-repositorio>
cd stock-pulse
```

2. **Suba todos os serviços:**

```bash
docker compose up -d
```

3. **Acesse a aplicação:**

| Serviço  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:8000 |

4. **Login padrão:**

```
Email: admin@stockpulse.com
Senha: admin123
```

### Comandos Úteis

```bash
# Ver status dos containers
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend

# Parar todos os serviços
docker compose down

# Parar e remover volumes (limpa o banco)
docker compose down -v

# Reconstruir imagens após alterações
docker compose up -d --build
```

## 🧪 Testes

### Testes Unitários

```bash
cd backend
npm install
npx prisma generate
npm run test
```

### Testes de Integração (E2E)

Os testes E2E precisam de um banco MySQL rodando:

```bash
# 1. Subir o banco via Docker
docker compose up db -d

# 2. Criar banco de teste
docker exec db mysql -uroot -proot -e "
  CREATE DATABASE IF NOT EXISTS stockpulse_test;
  CREATE USER IF NOT EXISTS 'test'@'%' IDENTIFIED BY 'test123';
  GRANT ALL PRIVILEGES ON stockpulse_test.* TO 'test'@'%';
  FLUSH PRIVILEGES;
"

# 3. Rodar os testes
cd backend
npm install
npx prisma generate
DATABASE_URL=mysql://test:test123@localhost:3306/stockpulse_test npx prisma db push
npm run test:e2e
```

## 🔄 CI/CD Pipeline

O projeto utiliza GitHub Actions com os seguintes jobs:

| Job            | Descrição                                    |
| -------------- | -------------------------------------------- |
| **Lint**       | Verifica estilo de código com ESLint         |
| **Unit Tests** | Executa testes unitários                     |
| **E2E Tests**  | Executa testes de integração com banco MySQL |

O pipeline é executado automaticamente em:

- Push para branches `main` e `dev`
- Pull requests para `main`

## 📝 Funcionalidades

- Sistema de autenticação (login/registro)
- Gerenciamento de produtos (CRUD)
- Controle de estoque
- Painel administrativo
- API RESTful protegida com JWT

## 📁 Estrutura do Projeto

```
stock-pulse/
├── backend/          # API NestJS
│   ├── src/
│   ├── test/         # Testes E2E
│   └── prisma/       # Schema do banco
├── frontend/         # App React
│   └── src/
├── docker-compose.yml
└── .github/
    └── workflows/    # Pipeline CI/CD
```
