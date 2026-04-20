# Arquitetura da Aplicação

## 📐 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet / Usuário                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTP/HTTPS
                 ▼
        ┌────────────────┐
        │   Frontend     │  port 5173
        │  React + Vite  │  - Navbar
        │  Tailwind CSS  │  - Sidebar
        └────────┬───────┘  - Páginas
                 │
                 │ API Calls (Axios)
                 ▼
        ┌────────────────┐
        │    Backend     │  port 8000
        │  FastAPI       │  - /produtos
        │  SQLModel      │  - /estoque
        └────────┬───────┘  - /vendas
                 │          - /financeiro
                 │ SQL
                 ▼
        ┌────────────────┐
        │  PostgreSQL    │  port 5432
        │    Database    │  - Produtos
        │                │  - Estoque
        │                │  - Vendas
        │                │  - Financeiro
        └────────────────┘
```

## 🐳 Arquitetura com Docker

```
┌──────────────────────────────────────────────────────────────┐
│                   Docker Host Machine                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Docker Network (estoque)                    │   │
│  │                                                     │   │
│  │  ┌─────────────┐  ┌──────────┐  ┌─────────────┐  │   │
│  │  │ Frontend    │  │ Backend  │  │ PostgreSQL  │  │   │
│  │  │ Container   │  │Container │  │ Container   │  │   │
│  │  │ port 5173   │  │port 8000 │  │ port 5432   │  │   │
│  │  │             │  │          │  │             │  │   │
│  │  │ node:24-    │  │python:3- │  │ postgres:16 │  │   │
│  │  │ alpine      │  │ 14-slim  │  │             │  │   │
│  │  └─────────────┘  └──────────┘  └─────────────┘  │   │
│  │       │                 │              │          │   │
│  │       │─────────────────┼──────────────│          │   │
│  │       │    Docker Network                        │   │
│  │       │    (DNS: service name)                   │   │
│  │                                                  │   │
│  │  Volumes:                                        │   │
│  │  - postgres_data: /var/lib/postgresql            │   │
│  │  - ./backend: hot-reload do código              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└──────────────────────────────────────────────────────────┘
         │                                      │
         │ Port Mapping                         │
         │ 5173 -> container 5173               │ Port Mapping
         │ 8000 -> container 8000               │ 5432 -> 5432
         │                                      │
         ▼                                      ▼
    localhost:5173                          localhost:5432
    localhost:8000                          localhost:5432
```

## 📦 Componentes e Responsabilidades

### Frontend (React + Vite)
- **Responsabilidade**: Interface do usuário
- **Tecnologias**:
  - React 18
  - Vite (bundler rápido)
  - Tailwind CSS (estilização)
  - Lucide React (ícones)
  - Axios (chamadas HTTP)
  - Recharts (gráficos)

### Backend (FastAPI)
- **Responsabilidade**: API REST, lógica de negócio
- **Tecnologias**:
  - FastAPI
  - SQLModel (ORM + validação)
  - Psycopg (driver PostgreSQL)
  - Uvicorn (ASGI server)
  - Pydantic (validação de dados)

### Database (PostgreSQL)
- **Responsabilidade**: Persistência de dados com ACID
- **Tabelas**:
  - produtos
  - estoque
  - vendas
  - financeiro

## 🔄 Fluxo de Dados

```
User Action (Frontend)
         │
         ▼
React Component
         │
         ▼
Axios HTTP Request
         │
         └─────────────────────────┐
                                   │
                                   ▼
                          FastAPI Endpoint
                                   │
                                   ▼
                          SQLModel Query
                                   │
                                   ▼
                          PostgreSQL Database
                                   │
                                   ▼
                          Return Result
                                   │
         ┌─────────────────────────┘
         │
         ▼
    JSON Response
         │
         ▼
React State Update
         │
         ▼
Component Re-render
         │
         ▼
Updated UI
```

## 🚀 Lifecycle com Docker Compose

```
docker-compose up --build
         │
         ├─→ Build Backend Image
         │     └─→ FROM python:3.14-slim
         │     └─→ COPY requirements.txt
         │     └─→ RUN pip install
         │     └─→ COPY app/
         │
         ├─→ Build Frontend Image
         │     └─→ FROM node:24-alpine (build)
         │     └─→ npm install
         │     └─→ npm run build
         │     └─→ FROM node:24-alpine (runtime)
         │     └─→ COPY dist/
         │
         ├─→ Create Network
         │     └─→ postgres <network> backend
         │     └─→ backend <network> frontend
         │
         └─→ Start Containers (respeitando depends_on)
               ├─→ postgres starts
               │    └─→ Wait for healthcheck
               ├─→ backend starts (depois do postgres)
               │    └─→ uvicorn app.main:app
               └─→ frontend starts (depois do backend)
                    └─→ serve -s dist
```

## 📊 Banco de Dados - Esquema Relacional

```
┌─────────────────┐
│   PRODUTOS      │
├─────────────────┤
│ id (PK)         │
│ codigo (UNIQUE) │
│ nome            │ ◄─────┐
│ descricao       │       │ 1:N
│ preco_custo     │       │
│ preco_venda     │       │
│ categoria       │       │
│ ativo           │       │
│ criado_em       │       │
│ atualizado_em   │       │
└─────────────────┘       │
          │               │
          │ 1:N           │
          ▼               │
┌─────────────────┐       │
│   ESTOQUE       │       │
├─────────────────┤       │
│ id (PK)         │       │
│ produto_id (FK) │───────┘
│ quantidade      │
│ quantidade_minima
│ localizacao     │
│ criado_em       │
│ atualizado_em   │
└─────────────────┘
          │
          │ 1:N
          ▼
┌─────────────────┐
│   VENDAS        │
├─────────────────┤
│ id (PK)         │
│ numero_recibo   │
│ cliente         │
│ produto_id (FK) │
│ quantidade      │
│ preco_unitario  │
│ total           │
│ data_venda      │
└─────────────────┘
          │
          │ 1:N
          ▼
┌─────────────────┐
│  FINANCEIRO     │
├─────────────────┤
│ id (PK)         │
│ venda_id (FK)   │
│ tipo            │ (entrada/saida)
│ descricao       │
│ valor           │
│ saldo_anterior  │
│ saldo_posterior │
│ data_movimentacao
└─────────────────┘
```

## 🔐 Segurança na Arquitetura

```
┌─────────────────────────────────────────┐
│     Frontend (Browser)                  │
│  ├─ CORS (controle de origem)          │
│  ├─ HTTPS (em produção)                │
│  └─ Input Validation                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     Backend (API)                       │
│  ├─ Authentication (JWT)               │
│  ├─ Authorization (roles)              │
│  ├─ Input Validation (Pydantic)        │
│  ├─ SQL Injection Prevention (ORM)     │
│  ├─ Rate Limiting                      │
│  └─ HTTPS (em produção)                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     Database (PostgreSQL)               │
│  ├─ Encrypted Password                 │
│  ├─ Private Network (docker network)   │
│  ├─ ACID Transactions                  │
│  └─ Access Control (roles)             │
└─────────────────────────────────────────┘
```

## 📈 Escalabilidade Futura

```
Atual (Single Instance):
┌──────────────────────────────────────┐
│   Docker Compose                     │
│   ├─ 1 Frontend Container            │
│   ├─ 1 Backend Container             │
│   └─ 1 PostgreSQL Container          │
└──────────────────────────────────────┘

Futuro (Kubernetes/Multi-container):
┌──────────────────────────────────────┐
│   Kubernetes Cluster                 │
│   ├─ 3 Frontend Pods (replicas)      │
│   ├─ 3 Backend Pods (replicas)       │
│   ├─ StatefulSet PostgreSQL          │
│   ├─ Ingress Controller              │
│   ├─ ConfigMaps & Secrets            │
│   └─ HPA (Auto Scaling)              │
└──────────────────────────────────────┘
```

## 🔍 Monitoring & Logs

```
┌─────────────────────────────────────┐
│   Application Logs                  │
│   ├─ docker-compose logs backend    │
│   ├─ docker-compose logs frontend   │
│   └─ docker-compose logs postgres   │
└─────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│   Monitoring Stack (Futuro)         │
│   ├─ Prometheus (métricas)          │
│   ├─ Grafana (dashboards)           │
│   ├─ ELK Stack (logs centralizados) │
│   └─ Alerting (notificações)        │
└─────────────────────────────────────┘
```
