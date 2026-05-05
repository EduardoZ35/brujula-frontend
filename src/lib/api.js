import axios from 'axios'

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL ?? 'https://oraculo-app.cl'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ''}/api`,
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('oraculo_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('oraculo_token')
      localStorage.removeItem('oraculo_user')
      const returnTo = encodeURIComponent(window.location.origin)
      window.location.href = `${PORTAL_URL}/login?redirect=${returnTo}`
    }
    return Promise.reject(error)
  },
)

export default api

export const getCategories = () => api.get('/brujula/categories')
export const createCategory = (data) => api.post('/brujula/categories', data)
export const deleteCategory = (id) => api.delete(`/brujula/categories/${id}`)

export const getSummary = (month) => api.get('/brujula/summary', { params: { month } })
export const getTransactions = (month) => api.get('/brujula/transactions', { params: { month } })
export const createTransaction = (data) => api.post('/brujula/transactions', data)
export const updateTransaction = (id, data) => api.put(`/brujula/transactions/${id}`, data)
export const deleteTransaction = (id) => api.delete(`/brujula/transactions/${id}`)
