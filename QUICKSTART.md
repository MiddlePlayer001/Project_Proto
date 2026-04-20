# Quick Start - Guia Rápido

## ⚡ 3 Passos para Começar

### 1️⃣ Iniciar Docker Compose
```bash
cd Project_Proto
docker-compose up --build
```

Aguarde uns 30-60 segundos para tudo inicializar.

### 2️⃣ Acessar a Aplicação
Abra seu navegador:
```
http://localhost:5173
```

### 3️⃣ Começar a Usar!
- Clique em "Novo Produto" ➕
- Preencha os dados
- Clique em "Salvar"
- Veja aparecer na tabela!

---

## 📋 Dados de Teste

Para testar, você pode criar um produto assim:

| Campo | Valor |
|-------|-------|
| Código | PROD001 |
| Nome | Notebook Samsung |
| Preço de Custo | 3500.00 |
| Preço de Venda | 4500.00 |
| Descrição | Notebook de alta performance |

---

## 🔗 URLs Importantes

| Serviço | URL |
|---------|-----|
| 💻 **Frontend** | http://localhost:5173 |
| 🔧 **API Backend** | http://localhost:8000 |
| 📖 **Documentação API** | http://localhost:8000/docs |
| 🐘 **PostgreSQL** | localhost:5432 |

---

## 📊 Credenciais

### PostgreSQL
```
Usuário: admin
Senha: admin123
Banco: estoque_db
```

### API
```
Tipo: REST
Autenticação: (não implementada ainda)
```

---

## 🛑 Para Parar Tudo

```bash
docker-compose down
```

Para parar E remover volumes (limpar dados):
```bash
docker-compose down -v
```

---

## 🔍 Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend

# Apenas banco de dados
docker-compose logs -f postgres
```

---

## 💡 Dicas

✅ **Hot-reload ativado**: Mude o código e veja as mudanças automaticamente  
✅ **PostgreSQL persistente**: Dados são salvos em volume Docker  
✅ **CORS habilitado**: Frontend pode chamar backend  
✅ **Documentação Swagger**: Veja em /docs  

---

## 🚀 Próximas Ações

Depois de testar o CRUD de produtos, você pode:

1. Explorar a API via Swagger em `/docs`
2. Criar mais produtos e testar Delete/Edit
3. Ler a documentação em `DOCKER.md` para mais comandos
4. Ler `ARQUITETURA.md` para entender a estrutura
5. Ver `STATUS.md` para o roadmap completo

---

## ❓ Dúvidas Comuns

### P: Porta 5173 já está em uso
**R**: `docker-compose down` e tente novamente

### P: "Connection refused" no Frontend
**R**: Aguarde o backend iniciar completamente (30-60 seg)

### P: Erro ao criar produto
**R**: Verifique o console (F12) para ver o erro exato

### P: Banco não está salvando dados
**R**: Confirme que está usando `docker-compose up` (não `npm run dev`)

---

**🎉 Divirta-se com seu novo sistema de estoque!**
