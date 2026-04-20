from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Produto(SQLModel, table=True):
    __tablename__ = "produtos"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    codigo: str = Field(unique=True, index=True, min_length=1)
    nome: str = Field(index=True, min_length=1)
    descricao: Optional[str] = None
    preco_custo: float = Field(gt=0)
    preco_venda: float = Field(gt=0)
    categoria: Optional[str] = Field(default="Geral")
    ativo: bool = Field(default=True)
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
