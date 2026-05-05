import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCLP } from '../lib/utils'

export default function ExpenseChart({ data = [] }) {
  if (!data.length) return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-slate-300 mb-3">Gastos por categoría</h2>
      <p className="text-slate-500 text-sm text-center py-6">Sin gastos este mes</p>
    </div>
  )

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-slate-300 mb-4">Gastos por categoría</h2>
      <div className="flex gap-4 items-center">
        <div className="w-36 h-36 flex-shrink-0">
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
        </div>
      </div>
    </div>
  )
}
