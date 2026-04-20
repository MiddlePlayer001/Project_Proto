import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { produtoService } from './services/api'
import { Plus, Trash2, DollarSign, TrendingUp } from 'lucide-react'

type PageType = 'produtos' | 'vendas' | 'financeiro' | 'dashboard'

interface Produto {
  id: number
  codigo: string
  nome: string
  descricao?: string
  preco_custo: number
  preco_venda: number
  categoria?: string
  ativo: boolean
}

interface Venda {
  id: number
  produto_id: number
  quantidade: number
  preco_unitario: number
  total: number
  data: string
}

interface Financeiro {
  id: number
  tipo: 'entrada' | 'saida'
  descricao: string
  valor: number
  data: string
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [vendas, setVendas] = useState<Venda[]>([])
  const [financeiro, setFinanceiro] = useState<Financeiro[]>([])
  const [loading, setLoading] = useState(true)
  
  // Produtos
  const [showProdutoForm, setShowProdutoForm] = useState(false)
  const [produtoForm, setProdutoForm] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    preco_custo: 0,
    preco_venda: 0,
    categoria: 'Geral',
  })
  
  // Vendas
  const [showVendaForm, setShowVendaForm] = useState(false)
  const [vendaForm, setVendaForm] = useState({
    produto_id: 0,
    quantidade: 1,
    preco_unitario: 0,
  })
  
  // Financeiro
  const [showFinanceiroForm, setShowFinanceiroForm] = useState(false)
  const [financeiroForm, setFinanceiroForm] = useState({
    tipo: 'entrada' as 'entrada' | 'saida',
    descricao: '',
    valor: 0,
  })

  useEffect(() => {
    carregarDados()
  }, [currentPage])

  const carregarDados = async () => {
    try {
      setLoading(true)
      if (currentPage === 'produtos') {
        const response = await produtoService.listar()
        setProdutos(response.data || [])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProdutoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await produtoService.criar(produtoForm)
      setProdutoForm({
        codigo: '',
        nome: '',
        descricao: '',
        preco_custo: 0,
        preco_venda: 0,
        categoria: 'Geral',
      })
      setShowProdutoForm(false)
      carregarDados()
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      alert('Erro ao criar produto')
    }
  }

  const handleVendaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const total = vendaForm.quantidade * vendaForm.preco_unitario
      const novaVenda: Venda = {
        id: vendas.length + 1,
        produto_id: vendaForm.produto_id,
        quantidade: vendaForm.quantidade,
        preco_unitario: vendaForm.preco_unitario,
        total: total,
        data: new Date().toISOString().split('T')[0],
      }
      setVendas([...vendas, novaVenda])
      setVendaForm({
        produto_id: 0,
        quantidade: 1,
        preco_unitario: 0,
      })
      setShowVendaForm(false)
      alert('Venda registrada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar venda:', error)
      alert('Erro ao registrar venda')
    }
  }

  const handleFinanceiroSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const novoMovimento: Financeiro = {
        id: financeiro.length + 1,
        tipo: financeiroForm.tipo,
        descricao: financeiroForm.descricao,
        valor: financeiroForm.valor,
        data: new Date().toISOString().split('T')[0],
      }
      setFinanceiro([...financeiro, novoMovimento])
      setFinanceiroForm({
        tipo: 'entrada',
        descricao: '',
        valor: 0,
      })
      setShowFinanceiroForm(false)
      alert('Movimento registrado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar movimento:', error)
      alert('Erro ao registrar movimento')
    }
  }

  const handleDeleteProduto = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await produtoService.deletar(id)
        carregarDados()
      } catch (error) {
        console.error('Erro ao deletar produto:', error)
        alert('Erro ao deletar produto')
      }
    }
  }

  const totalEntradas = financeiro
    .filter(f => f.tipo === 'entrada')
    .reduce((sum, f) => sum + f.valor, 0)
  
  const totalSaidas = financeiro
    .filter(f => f.tipo === 'saida')
    .reduce((sum, f) => sum + f.valor, 0)
  
  const saldoTotal = totalEntradas - totalSaidas
  const totalVendas = vendas.reduce((sum, v) => sum + v.total, 0)

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      <div className="space-y-6 pb-32">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentPage === 'dashboard' && 'Dashboard'}
              {currentPage === 'produtos' && 'Produtos'}
              {currentPage === 'vendas' && 'Vendas'}
              {currentPage === 'financeiro' && 'Financeiro'}
            </h1>
            <p className="text-gray-600 mt-1">
              {currentPage === 'dashboard' && 'Visão geral do sistema'}
              {currentPage === 'produtos' && 'Gerenciamento de produtos em estoque'}
              {currentPage === 'vendas' && 'Registro de vendas e transações'}
              {currentPage === 'financeiro' && 'Controle financeiro e fluxo de caixa'}
            </p>
          </div>
          {currentPage !== 'dashboard' && (
            <button
              onClick={() => {
                if (currentPage === 'produtos') setShowProdutoForm(!showProdutoForm)
                else if (currentPage === 'vendas') setShowVendaForm(!showVendaForm)
                else if (currentPage === 'financeiro') setShowFinanceiroForm(!showFinanceiroForm)
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              {currentPage === 'produtos' && 'Novo Produto'}
              {currentPage === 'vendas' && 'Nova Venda'}
              {currentPage === 'financeiro' && 'Novo Movimento'}
            </button>
          )}
        </div>

        {/* ===== PRODUTOS ===== */}
        {currentPage === 'produtos' && (
          <>
            {showProdutoForm && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Criar Novo Produto</h2>
                <form onSubmit={handleProdutoSubmit} className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código do Produto</label>
                    <input
                      type="text"
                      placeholder="Ex: PROD001"
                      value={produtoForm.codigo}
                      onChange={(e) => setProdutoForm({ ...produtoForm, codigo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                    <input
                      type="text"
                      placeholder="Ex: Camiseta Azul"
                      value={produtoForm.nome}
                      onChange={(e) => setProdutoForm({ ...produtoForm, nome: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 100.00"
                      value={produtoForm.preco_custo}
                      onChange={(e) => setProdutoForm({ ...produtoForm, preco_custo: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 150.00"
                      value={produtoForm.preco_venda}
                      onChange={(e) => setProdutoForm({ ...produtoForm, preco_venda: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                    <textarea
                      placeholder="Ex: Produto de alta qualidade, cor azul..."
                      value={produtoForm.descricao}
                      onChange={(e) => setProdutoForm({ ...produtoForm, descricao: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProdutoForm(false)}
                      className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-6 text-center text-gray-600">Carregando produtos...</div>
              ) : produtos.length === 0 ? (
                <div className="p-6 text-center text-gray-600">Nenhum produto cadastrado</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Código</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preço Custo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preço Venda</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Margem</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {produtos.map((produto) => {
                      const margem = ((produto.preco_venda - produto.preco_custo) / produto.preco_custo * 100).toFixed(1)
                      return (
                        <tr key={produto.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{produto.codigo}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{produto.nome}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">R$ {produto.preco_custo.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">R$ {produto.preco_venda.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-green-600 font-semibold">{margem}%</td>
                          <td className="px-6 py-4 text-sm flex gap-2">
                            <button onClick={() => handleDeleteProduto(produto.id)} className="text-red-600 hover:text-red-800">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ===== VENDAS ===== */}
        {currentPage === 'vendas' && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total de Vendas</p>
                <p className="text-2xl font-bold text-blue-600">R$ {totalVendas.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Quantidade de Vendas</p>
                <p className="text-2xl font-bold text-green-600">{vendas.length}</p>
              </div>
            </div>

            {showVendaForm && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Registrar Nova Venda</h2>
                <form onSubmit={handleVendaSubmit} className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                    <select
                      value={vendaForm.produto_id}
                      onChange={(e) => {
                        const produtoId = parseInt(e.target.value)
                        const produto = produtos.find(p => p.id === produtoId)
                        setVendaForm({
                          ...vendaForm,
                          produto_id: produtoId,
                          preco_unitario: produto?.preco_venda || 0,
                        })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value={0}>Selecione um produto</option>
                      {produtos.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} (R$ {p.preco_venda.toFixed(2)})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ex: 5"
                      value={vendaForm.quantidade}
                      onChange={(e) => setVendaForm({ ...vendaForm, quantidade: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unitário (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 150.00"
                      value={vendaForm.preco_unitario}
                      onChange={(e) => setVendaForm({ ...vendaForm, preco_unitario: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total (R$)</label>
                    <input
                      type="number"
                      disabled
                      value={(vendaForm.quantidade * vendaForm.preco_unitario).toFixed(2)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                      Registrar Venda
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowVendaForm(false)}
                      className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {vendas.length === 0 ? (
                <div className="p-6 text-center text-gray-600">Nenhuma venda registrada</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Produto</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantidade</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preço Unit.</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {vendas.map((venda) => (
                      <tr key={venda.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">#{venda.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{produtos.find(p => p.id === venda.produto_id)?.nome || 'Desconhecido'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{venda.quantidade}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">R$ {venda.preco_unitario.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-green-600 font-semibold">R$ {venda.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{venda.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ===== FINANCEIRO ===== */}
        {currentPage === 'financeiro' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Entradas</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalEntradas.toFixed(2)}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Saídas</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalSaidas.toFixed(2)}</p>
              </div>
              <div className={`p-4 rounded-lg ${saldoTotal >= 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                <p className="text-sm text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>R$ {saldoTotal.toFixed(2)}</p>
              </div>
            </div>

            {showFinanceiroForm && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Registrar Movimento Financeiro</h2>
                <form onSubmit={handleFinanceiroSubmit} className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimento</label>
                    <select
                      value={financeiroForm.tipo}
                      onChange={(e) => setFinanceiroForm({ ...financeiroForm, tipo: e.target.value as 'entrada' | 'saida' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="entrada">Entrada (Receita)</option>
                      <option value="saida">Saída (Despesa)</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 500.00"
                      value={financeiroForm.valor}
                      onChange={(e) => setFinanceiroForm({ ...financeiroForm, valor: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                      placeholder="Ex: Venda de produtos, Aluguel do espaço, Compra de estoque..."
                      value={financeiroForm.descricao}
                      onChange={(e) => setFinanceiroForm({ ...financeiroForm, descricao: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                      Registrar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFinanceiroForm(false)}
                      className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              {financeiro.length === 0 ? (
                <div className="p-6 text-center text-gray-600">Nenhum movimento registrado</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valor</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {financeiro.map((mov) => (
                      <tr key={mov.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">#{mov.id}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${mov.tipo === 'entrada' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{mov.descricao}</td>
                        <td className={`px-6 py-4 text-sm font-semibold ${mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                          {mov.tipo === 'entrada' ? '+' : '-'} R$ {mov.valor.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{mov.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* DASHBOARD */}
        {currentPage === 'dashboard' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total de Produtos</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{produtos.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Total de Vendas</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{vendas.length}</p>
              <p className="text-sm text-gray-500 mt-2">R$ {vendas.reduce((sum, v) => sum + v.total, 0).toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Saldo Financeiro</p>
              <p className={`text-4xl font-bold mt-2 ${saldoTotal >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                R$ {saldoTotal.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
