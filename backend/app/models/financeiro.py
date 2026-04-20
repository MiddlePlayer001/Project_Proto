from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class TipoMovimentacao(str, Enum):
    ENTRADA = "entrada"
    SAIDA = "saida"

class Financeiro(SQLModel, table=True):
    __tablename__ = "financeiro"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    venda_id: Optional[int] = Field(default=None, foreign_key="vendas.id")
    tipo: TipoMovimentacao
    descricao: str
    valor: float
    saldo_anterior: float = Field(default=0)
    saldo_posterior: float = Field(default=0)
    data_movimentacao: datetime = Field(default_factory=datetime.utcnow)
    criado_em: datetime = Field(default_factory=datetime.utcnow)
