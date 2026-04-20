from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Estoque(SQLModel, table=True):
    __tablename__ = "estoque"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    produto_id: int = Field(foreign_key="produtos.id", index=True)
    quantidade: int
    quantidade_minima: int = Field(default=0)
    localizacao: str
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
