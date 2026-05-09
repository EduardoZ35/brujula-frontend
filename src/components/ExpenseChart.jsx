import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { X } from 'lucide-react'
import { formatCLP } from '../lib/utils'

function CategoryModal({ data, onClose }) {
  const total = data.reduce((sum, cat) => sum + cat.total, 0)
  const sorted = [...data].sort((a, b) => b.total - a.total)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Gastos por categoría</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {sorted.map((cat, i) => {
            const pct = total > 0 ? ((cat.total / total) * 100).toFixed(1) : 0
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color || '#64748b' }} />
                <span className="flex-1 text-sm text-slate-300 truncate">{cat.category_name ?? 'Sin categoría'}</span>
                <span className="text-xs text-slate-500 flex-shrink-0">{pct}%</span>
                <span className="text-sm font-semibold text-slate-100 flex-shrink-0 w-24 text-right">{formatCLP(cat.total)}</span>
              </div>
            )
          })}
        </div>

        <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
          <span className="text-sm text-slate-400">Total gastos</span>
          <span className="text-base font-bold text-white">{formatCLP(total)}</span>
        </div>
      </div>
    </div>
  )
}

export default function ExpenseChart({ data = [] }) {
  const [modalOpen, setModalOpen] = useState(false)

  if (!data.length) return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-slate-300 mb-3">Gastos por categoría</h2>
      <p className="text-slate-500 text-sm text-center py-6">Sin gastos este mes</p>
    </div>
  )

  return (
    <>
      <div className="bg-slate-800 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Gastos por categoría</h2>
        <div className="flex gap-4 items-center">
          <div className="w-36 h-36 flex-shrink-0 cursor-pointer" onClick={() => setModalOpen(true)}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="category_name"
                  innerRadius="68%"
                  outerRadius="100%"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatCLP(v)}
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2.5 overflow-hidden">
            {data.slice(0, 5).map((cat, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color || '#64748b' }} />
                  <span className="text-xs text-slate-300 truncate">{cat.category_name ?? 'Sin categoría'}</span>
                </div>
                <span className="text-xs font-semibold text-slate-200 flex-shrink-0">{formatCLP(cat.total)}</span>
              </div>
            ))}
            {data.length > 5 && (
              <button
                onClick={() => setModalOpen(true)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-1"
              >
                +{data.length - 5} más...
              </button>
            )}
          </div>
        </div>
      </div>

      {modalOpen && <CategoryModal data={data} onClose={() => setModalOpen(false)} />}
    </>
  )
}
