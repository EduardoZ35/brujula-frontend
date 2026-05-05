export const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export function formatCLP(amount) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount)
}

export function monthLabel(ym) {
  const [y, m] = ym.split('-')
  return `${MONTHS[parseInt(m) - 1]} ${y}`
}

export function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

export function prevMonth(ym) {
  const d = new Date(`${ym}-01`)
  d.setMonth(d.getMonth() - 1)
  return d.toISOString().slice(0, 7)
}

export function nextMonth(ym) {
  const d = new Date(`${ym}-01`)
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().slice(0, 7)
}

export function groupByDate(transactions) {
  return transactions.reduce((acc, tx) => {
    const key = tx.date
    if (!acc[key]) acc[key] = []
    acc[key].push(tx)
    return acc
  }, {})
}

export function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
}
