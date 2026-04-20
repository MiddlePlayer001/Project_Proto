import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000',
})

export const produtoService = {
  listar: () => API.get('/produtos'),
  obter: (id: number) => API.get(`/produtos/${id}`),
  criar: (data: any) => API.post('/produtos', data),
  atualizar: (id: number, data: any) => API.put(`/produtos/${id}`, data),
  deletar: (id: number) => API.delete(`/produtos/${id}`),
}

export default API
