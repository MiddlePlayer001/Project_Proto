import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { produtoService } from './services/api'
import { Plus, Trash2, Edit } from 'lucide-react'

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

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    preco_custo: 0,
    preco_venda: 0,
    categoria: 'Geral',
  })

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    try {
      setLoading(true)
      const response = await produtoService.listar()
      setProdutos(response.data)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await produtoService.criar(formData)
      setFormData({
        codigo: '',
        nome: '',
        descricao: '',
        preco_custo: 0,
        preco_venda: 0,
        categoria: 'Geral',
      })
      setShowForm(false)
      carregarProdutos()
    } catch (error) {
      console.error('Erro ao criar produto:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await produtoService.deletar(id)
        carregarProdutos()
      } catch (error) {
        console.error('Erro ao deletar produto:', error)
      }
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-600 mt-1">Gerenciamento de produtos em estoque</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Novo Produto
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Criar Novo Produto</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Código"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Preço de Custo"
                value={formData.preco_custo}
                onChange={(e) => setFormData({ ...formData, preco_custo: parseFloat(e.target.value) })}
                className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Preço de Venda"
                value={formData.preco_venda}
                onChange={(e) => setFormData({ ...formData, preco_venda: parseFloat(e.target.value) })}
                className="col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Descrição"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
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
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id)}
                          className="text-red-600 hover:text-red-800"
                        >
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
      </div>
    </Layout>
  )
}
