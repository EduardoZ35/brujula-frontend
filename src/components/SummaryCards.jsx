import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCLP } from '../lib/utils'

export default function SummaryCards({ summary }) {
  const income  = summary?.total_income  ?? 0
  const expense = summary?.total_expense ?? 0
  const balance = summary?.balance       ?? 0

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Ingresos</span>
        </div>
        <span className="text-base font-bold text-emerald-400 truncate">{formatCLP(income)}</span>
      </div>

      <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-rose-400">
          <TrendingDown className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Gastos</span>
        </div>
        <span className="text-base font-bold text-rose-400 truncate">{formatCLP(expense)}</span>
      </div>

      <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-sky-400">
          <Wallet className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Saldo</span>
        </div>
        <span className={`text-base font-bold truncate ${balance >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
          {formatCLP(balance)}
        </span>
      </div>
    </div>
  )
}
