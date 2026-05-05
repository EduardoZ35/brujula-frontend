import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

function localToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const EMPTY = { type: 'gasto', amount: '', description: '', category_id: '', date: localToday(), notes: '' }

export default function TransactionModal({ open, onClose, onSave, categories = [], initial = null }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setForm(initial ? { ...initial, amount: String(initial.amount) } : EMPTY)
  }, [open, initial])

  if (!open) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const filteredCats = categories.filter(c => c.type === form.type)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        ...form,
        amount: parseFloat(form.amount),
        category_id: form.category_id ? parseInt(form.category_id) : null,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 space-y-4">

        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{initial ? 'Editar transacción' : 'Nueva transacción'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-lg transition">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo toggle */}
          <div className="flex rounded-xl overflow-hidden bg-slate-900 p-1 gap-1">
            {['gasto', 'ingreso'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { set('type', t); set('category_id', '') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition ${
                  form.type === t
                    ? t === 'gasto' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'gasto' ? 'Gasto' : 'Ingreso'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Monto</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                required
                type="number"
                min="1"
                step="1"
                placeholder="0"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-4 py-3 text-lg font-bold focus:outline-none focus:border-sky-500 transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Descripción</label>
            <input
              type="text"
              maxLength={255}
              placeholder="¿En qué fue?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          {/* Category + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Categoría</label>
              <select
                value={form.category_id}
                onChange={e => set('category_id', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-sky-500 transition"
              >
                <option value="">Sin categoría</option>
                {filteredCats.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Fecha</label>
              <input
                required
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-sky-500 transition"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">
              Notas <span className="text-slate-600">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Notas adicionales..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition text-sm"
          >
            {saving ? 'Guardando…' : 'Guardar transacción'}
          </button>
        </form>
      </div>
    </div>
  )
}
