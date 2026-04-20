# Docker Compose - Guia de Uso

## 🚀 Iniciar Tudo em Um Comando

```bash
docker-compose up --build
```

Isso vai:
1. ✅ Clonar/atualizar imagens necessárias
2. ✅ Construir imagens customizadas (backend e frontend)
3. ✅ Criar e iniciar 3 containers:
   - **PostgreSQL** (banco de dados)
   - **Backend** (API FastAPI)
   - **Frontend** (App React)

## 📊 Verificar Status

```bash
docker-compose ps
```

Output esperado:
```
NAME               IMAGE              COMMAND                SERVICE   STATUS
estoque-backend    ...backend:latest  uvicorn app.main...   backend   Up
estoque-frontend   ...frontend:latest docker-entrypoint...  frontend  Up
estoque-postgres   postgres:16        docker-entrypoint...  postgres  Up (healthy)
```

## 🔗 URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:5173 | App React |
| Backend | http://localhost:8000 | API FastAPI |
| Docs API | http://localhost:8000/docs | Swagger Documentation |
| PgAdmin | - | Configure se necessário |

## 📝 Comandos Úteis

### Visualizar Logs
```bash
# Todos os serviços
docker-compose logs

# Serviço específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Com acompanhamento em tempo real
docker-compose logs -f backend
```

### Parar Serviços
```bash
# Parar sem remover
docker-compose stop

# Parar e remover (limpo)
docker-compose down

# Limpar volumes (banco de dados)
docker-compose down -v
```

### Rebuild
```bash
# Rebuild de um serviço
docker-compose up --build backend

# Rebuild completo
docker-compose up --build
```

### Acessar Container
```bash
# Bash no backend
docker-compose exec backend bash

# Python shell no backend
docker-compose exec backend python

# PostgreSQL CLI
docker-compose exec postgres psql -U admin -d estoque_db
```

## 🔧 Configuração

### Variáveis de Ambiente

**Backend** (já configurado no docker-compose.yml):
- `DATABASE_URL`: postgresql+psycopg://admin:admin123@postgres:5432/estoque_db
- `SECRET_KEY`: sua-chave-secreta-super-segura-aqui
- `ALGORITHM`: HS256
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 30

**PostgreSQL**:
- `POSTGRES_USER`: admin
- `POSTGRES_PASSWORD`: admin123
- `POSTGRES_DB`: estoque_db

### Volumes

- `postgres_data`: Persiste dados do PostgreSQL
- `./backend`: Mount do código-fonte (hot-reload)

## 🐛 Troubleshooting

### "Port 8000 is already in use"
```bash
docker-compose down
```

### "Connection refused" no Frontend
Verificar se backend está saudável:
```bash
docker-compose logs backend
```

### PostgreSQL não inicia
```bash
docker-compose down -v
docker-compose up
```

### Limpar tudo e começar do zero
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## 📚 Estrutura do Docker

```
Project_Proto/
├── Dockerfile.backend      # Imagem FastAPI
├── Dockerfile.frontend     # Imagem React
├── docker-compose.yml      # Orquestração
├── .dockerignore          # Arquivos ignorados no build
└── [código da aplicação]
```

### Dockerfile.backend
- Base: `python:3.14-slim`
- Instala dependências Python
- Cria usuário não-root (recomendado)
- Expõe porta 8000

### Dockerfile.frontend
- Build stage: `node:24-alpine`
- Runtime stage: `node:24-alpine` com `serve`
- Otimização de tamanho com multi-stage
- Expõe porta 5173

## 🔐 Segurança em Produção

⚠️ Antes de fazer deploy em produção:

1. Alterar `SECRET_KEY` em `.env`
2. Alterar senha do PostgreSQL
3. Usar volumes para persistência
4. Adicionar healthchecks
5. Configurar logging adequado
6. Usar secrets do Docker/Kubernetes
7. Implementar rate limiting
8. Adicionar validação de CORS

## 📦 Fazer Build Manual das Imagens

```bash
# Backend
docker build -f Dockerfile.backend -t estoque-backend:1.0 .

# Frontend
docker build -f Dockerfile.frontend -t estoque-frontend:1.0 .
```

## 🚀 Deploy

Para fazer push das imagens para Docker Hub:

```bash
# Tag das imagens
docker tag estoque-backend:1.0 seu-usuario/estoque-backend:1.0
docker tag estoque-frontend:1.0 seu-usuario/estoque-frontend:1.0

# Push
docker push seu-usuario/estoque-backend:1.0
docker push seu-usuario/estoque-frontend:1.0
```
