# Sistema de Gestão de Estoque 📦

## Stack Tecnológico

- **Backend**: Python + FastAPI + SQLModel + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: PostgreSQL (Docker)
- **Containerização**: Docker + Docker Compose

## Estrutura do Projeto

```
Project_Proto/
├── backend/          # API FastAPI
│   ├── app/
│   │   ├── models/       # Modelos SQLModel
│   │   ├── routes/       # Endpoints da API
│   │   ├── schemas/      # Schemas Pydantic
│   │   ├── services/     # Lógica de negócio
│   │   ├── database/     # Configuração do BD
│   │   ├── core/         # Configurações globais
│   │   └── main.py       # App principal
│   ├── requirements.txt
│   ├── .env
│   └── migrations/
├── frontend/         # App React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── hooks/        # Hooks customizados
│   │   ├── services/     # Chamadas à API
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker-compose.yml
└── README.md
```

## ⚡ Como Iniciar (2 Opções)

### Opção 1: Com Docker Compose (Recomendado) 🐳

```bash
# Iniciar todos os containers
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

Isso vai iniciar:
- ✅ PostgreSQL em localhost:5432
- ✅ Backend em http://localhost:8000
- ✅ Frontend em http://localhost:5173

Para parar:
```bash
docker-compose down
```

**Para mais detalhes, veja [DOCKER.md](./DOCKER.md)**

### Opção 2: Sem Docker (Desenvolvimento Local)

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
# API disponível em http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # (se necessário)
npm run dev
# App disponível em http://localhost:5173
```

**PostgreSQL via Docker (se preferir):**
```bash
docker run --name project-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin123 -e POSTGRES_DB=estoque_db -p 5432:5432 -d postgres:latest
```

## 📊 Acessar a Aplicação

```
🌐 Frontend:    http://localhost:5173
🔧 API:         http://localhost:8000
📖 Docs API:    http://localhost:8000/docs (Swagger)
🐘 Banco:       localhost:5432
```

**Credenciais do Banco:**
- Usuário: admin
- Senha: admin123
- Database: estoque_db

## 📋 Features Implementadas

✅ Estrutura base do backend (FastAPI)  
✅ Modelos de dados (Produto, Estoque, Venda, Financeiro)  
✅ Rotas CRUD para Produtos  
✅ Conectividade PostgreSQL  
✅ Frontend React com Tailwind  
✅ Navbar e layout responsivo  
✅ CRUD de Produtos (Listar, Criar, Deletar)  
✅ Integração Backend-Frontend  
✅ **Dockerização completa**

## 🚀 Comandos Docker Úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs de um serviço
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Parar todos os containers
docker-compose down

# Remover volumes (limpar banco)
docker-compose down -v

# Acessar PostgreSQL dentro do container
docker-compose exec postgres psql -U admin -d estoque_db

# Rebuild de um serviço específico
docker-compose up --build backend
```

## 📝 Próximas Etapas

- [ ] Rotas de Estoque e Vendas
- [ ] Dashboard com gráficos (Recharts)
- [ ] Geração de Recibos em PDF
- [ ] Autenticação JWT
- [ ] Relatórios financeiros
- [ ] Testes unitários
- [ ] CI/CD Pipeline

## 🔧 Configuração do Banco

O PostgreSQL está configurado com:
- Host: localhost (ou 'postgres' dentro dos containers)
- Porta: 5432
- Usuário: admin
- Senha: admin123
- Database: estoque_db

As tabelas serão criadas automaticamente quando o backend iniciar.

## 📚 Documentação da API

Acesse http://localhost:8000/docs para ver a documentação interativa da API (Swagger).

### Endpoints Disponíveis

**Produtos:**
- `GET /produtos` - Listar todos os produtos
- `POST /produtos` - Criar novo produto
- `GET /produtos/{id}` - Obter produto específico
- `PUT /produtos/{id}` - Atualizar produto
- `DELETE /produtos/{id}` - Deletar produto

**Saúde:**
- `GET /health` - Verificar status da API
- `GET /` - Mensagem de boas-vindas


