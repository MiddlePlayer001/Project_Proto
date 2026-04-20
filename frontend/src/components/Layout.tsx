import { ReactNode } from 'react'
import { Menu, X, Package, BarChart3, DollarSign, LogOut } from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
  currentPage?: 'produtos' | 'vendas' | 'financeiro' | 'dashboard'
  onPageChange?: (page: 'produtos' | 'vendas' | 'financeiro' | 'dashboard') => void
}

export function Layout({ children, currentPage = 'dashboard', onPageChange }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', page: 'dashboard' },
    { icon: Package, label: 'Produtos', page: 'produtos' },
    { icon: BarChart3, label: 'Vendas', page: 'vendas' },
    { icon: DollarSign, label: 'Financeiro', page: 'financeiro' },
  ] as const

  const handleMenuClick = (page: typeof menuItems[number]['page']) => {
    onPageChange?.(page)
    setIsMenuOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${
        isMenuOpen ? 'block' : 'hidden'
      } md:block w-64 bg-gray-900 text-white transition-all duration-300`}>
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package size={28} />
            Proto_Gestor
          </h1>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item.page)}
              className={`w-full text-left flex items-center gap-3 px-6 py-3 transition-colors ${
                currentPage === item.page
                  ? 'bg-blue-600 border-l-4 border-blue-400'
                  : 'hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
          <button className="flex items-center gap-2 w-full text-red-400 hover:text-red-300">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Sistema de Gestão de Estoque</h2>
            <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
