from pydantic import BaseModel, Field
from typing import Optional

class ProdutoCreate(BaseModel):
    codigo: str
    nome: str
    descricao: Optional[str] = None
    preco_custo: float = Field(gt=0)
    preco_venda: float = Field(gt=0)

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    preco_custo: Optional[float] = Field(None, gt=0)
    preco_venda: Optional[float] = Field(None, gt=0)

class ProdutoResponse(ProdutoCreate):
    id: int
