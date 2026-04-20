from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Venda(SQLModel, table=True):
    __tablename__ = "vendas"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    numero_recibo: str = Field(unique=True, index=True)
    cliente: str
    produto_id: int = Field(foreign_key="produtos.id")
    quantidade: int
    preco_unitario: float
    total: float
    data_venda: datetime = Field(default_factory=datetime.utcnow)
    criado_em: datetime = Field(default_factory=datetime.utcnow)
