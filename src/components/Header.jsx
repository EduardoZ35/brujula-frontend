import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { monthLabel, prevMonth, nextMonth, currentMonth } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'

export default function Header({ month, onMonthChange }) {
  const { user, logout } = useAuth()
  const isCurrentMonth = month === currentMonth()

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '??'

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-sky-400">Brújula</span>
        <span className="text-slate-500 text-sm">💸</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onMonthChange(prevMonth(month))}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium w-32 text-center">{monthLabel(month)}</span>
        <button
          onClick={() => onMonthChange(nextMonth(month))}
          disabled={isCurrentMonth}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div
          title={user?.name ?? ''}
          className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-xs font-bold cursor-default"
        >
          {initials}
        </div>
        <button
          onClick={logout}
          title="Cerrar sesión"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
