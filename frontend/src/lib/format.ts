export function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Short rupiah for stat cards: 3998000 -> "Rp 4 jt". */
export function formatCompactRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('id-ID').format(value)
}

export function formatClock(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/** Date-only strings are parsed as local dates so they never shift a day. */
function parseDate(value: string): Date {
  return value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value)
}

/** "2026-11-09T09:15:00+07:00" or "2026-11-09" -> "9 Nov 2026". */
export function formatDate(value: string | Date) {
  const date = typeof value === 'string' ? parseDate(value) : value
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** ISO timestamp -> "09.15". */
export function formatTime(value: string | Date) {
  const date = typeof value === 'string' ? parseDate(value) : value
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/** ISO timestamp -> "9 Nov 2026, 09.15". */
export function formatDateTime(value: string | Date) {
  const date = typeof value === 'string' ? parseDate(value) : value
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
