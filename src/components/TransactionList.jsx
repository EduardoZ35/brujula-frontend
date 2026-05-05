import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { formatCLP, formatDate, groupByDate } from '../lib/utils'
import * as icons from 'lucide-react'

function CategoryIcon({ name, color }) {
  const pascal = name
    ? name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')
    : 'Circle'
  const Icon = icons[pascal] ?? icons.Circle
  return <Icon className="w-4 h-4" style={{ color }} />
}

function TxRow({ tx, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const isIncome = tx.type === 'ingreso'

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-700/50 last:border-0 relative">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${tx.category_color || '#64748b'}20` }}
      >
        <CategoryIcon name={tx.category_icon} color={tx.category_color || '#64748b'} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-100 truncate">{tx.description || '—'}</p>
        <p className="text-xs text-slate-500">{tx.category_name ?? 'Sin categoría'}</p>
      </div>

      <span className={`text-sm font-semibold flex-shrink-0 ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isIncome ? '+' : '-'}{formatCLP(tx.amount)}
      </span>

      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="p-1 hover:bg-slate-700 rounded-lg transition"
        >
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </button>
        {open && (
          <div className="absolute right-0 top-8 z-10 bg-slate-700 rounded-xl shadow-lg overflow-hidden w-32">
            <button
              onClick={() => { setOpen(false); onEdit(tx) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-slate-200 hover:bg-slate-600 transition"
            >
              <Pencil className="w-3.5 h-3.5" /> Editar
            </button>
            <button
              onClick={() => { setOpen(false); onDelete(tx) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-rose-400 hover:bg-slate-600 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TransactionList({ transactions = [], onEdit, onDelete }) {
  const [filter, setFilter] = useState('all')

  const filtered = transactions.filter(tx =>
    filter === 'all' || tx.type === filter
  )
  const grouped = groupByDate(filtered)
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  if (!transactions.length) return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-slate-300 mb-3">Transacciones</h2>
      <p className="text-slate-500 text-sm text-center py-6">Sin transacciones este mes</p>
    </div>
  )

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-slate-300 mb-4">Transacciones</h2>

      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {[['all','Todas'],['ingreso','Ingresos'],['gasto','Gastos']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 transition ${
              filter === val ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {dates.map(date => (
        <div key={date}>
          <p className="text-xs text-slate-500 font-medium pt-2 pb-1 capitalize">{formatDate(date)}</p>
          {grouped[date].map(tx => (
            <TxRow key={tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ))}
    </div>
  )
}
