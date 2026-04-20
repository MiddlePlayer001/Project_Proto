from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import create_db_and_tables
from app.routes.produto import router as produto_router

app = FastAPI(
    title="Sistema de Gestão de Estoque",
    description="API para gerenciamento de estoque com controle financeiro",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(produto_router)

@app.get("/")
def read_root():
    return {"message": "Sistema de Gestão de Estoque - API ativa"}

@app.get("/health")
def health():
    return {"status": "ok"}
