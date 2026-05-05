import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import ExpenseChart from './components/ExpenseChart'
import TransactionList from './components/TransactionList'
import TransactionModal from './components/TransactionModal'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { currentMonth } from './lib/utils'
import {
  getSummary, getTransactions, getCategories,
  createTransaction, updateTransaction, deleteTransaction,
} from './lib/api'

function Dashboard() {
  const [month, setMonth] = useState(currentMonth)
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [s, t, c] = await Promise.all([
        getSummary(month),
        getTransactions(month),
        getCategories(),
      ])
      setSummary(s.data)
      setTransactions(t.data)
      setCategories(c.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => { load() }, [load])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function handleSave(data) {
    if (editing) {
      await updateTransaction(editing.id, data)
      showToast('Transacción actualizada')
    } else {
      await createTransaction(data)
      showToast('Transacción guardada')
    }
    load()
  }

  async function handleDelete(tx) {
    if (!confirm(`¿Eliminar "${tx.description || 'esta transacción'}"?`)) return
    await deleteTransaction(tx.id)
    showToast('Transacción eliminada')
    load()
  }

  function openNew() { setEditing(null); setModalOpen(true) }
  function openEdit(tx) { setEditing(tx); setModalOpen(true) }

  return (
    <div className="min-h-screen pb-24">
      <Header month={month} onMonthChange={setMonth} />

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <SummaryCards summary={summary} />
            <ExpenseChart data={summary?.expense_by_category ?? []} />
            <TransactionList
              transactions={transactions}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>

      <button
        onClick={openNew}
        className="fixed bottom-6 right-6 w-14 h-14 bg-sky-500 hover:bg-sky-400 rounded-full shadow-lg flex items-center justify-center transition z-20"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categories={categories}
        initial={editing}
      />

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const { user, logout } = useAuth()
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
