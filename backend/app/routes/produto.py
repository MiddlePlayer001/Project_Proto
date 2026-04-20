from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database.connection import get_session
from app.models.produto import Produto
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoResponse

router = APIRouter(prefix="/produtos", tags=["produtos"])

@router.get("", response_model=list[ProdutoResponse])
def listar_produtos(session: Session = Depends(get_session)):
    produtos = session.exec(select(Produto)).all()
    return produtos

@router.post("", response_model=ProdutoResponse)
def criar_produto(produto: ProdutoCreate, session: Session = Depends(get_session)):
    db_produto = Produto.from_orm(produto)
    session.add(db_produto)
    session.commit()
    session.refresh(db_produto)
    return db_produto

@router.get("/{produto_id}", response_model=ProdutoResponse)
def obter_produto(produto_id: int, session: Session = Depends(get_session)):
    produto = session.get(Produto, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

@router.put("/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(
    produto_id: int,
    produto_atualizado: ProdutoUpdate,
    session: Session = Depends(get_session)
):
    produto = session.get(Produto, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    dados = produto_atualizado.dict(exclude_unset=True)
    for chave, valor in dados.items():
        setattr(produto, chave, valor)
    
    session.add(produto)
    session.commit()
    session.refresh(produto)
    return produto

@router.delete("/{produto_id}")
def deletar_produto(produto_id: int, session: Session = Depends(get_session)):
    produto = session.get(Produto, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    session.delete(produto)
    session.commit()
    return {"mensagem": "Produto deletado com sucesso"}
