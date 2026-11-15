/**
 * The API speaks in machine values (`dikerjakan`, `belum_lunas`).
 * The UI speaks Indonesian. Every translation lives here so a status is only
 * spelled once, and adding a new backend value causes one compile error.
 */
import type {
  PaymentMethod,
  PaymentStatus,
  StockMovementType,
  StockStatus,
  TransactionType,
  UnitStatus,
  WorkOrderStatus,
} from '../api/types'

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

type StatusMeta = { label: string; tone: StatusTone }

export const workOrderStatusLabels: Record<WorkOrderStatus, StatusMeta> = {
  menunggu: { label: 'Menunggu', tone: 'neutral' },
  inspeksi: { label: 'Inspeksi', tone: 'info' },
  dikerjakan: { label: 'Dikerjakan', tone: 'warning' },
  selesai: { label: 'Selesai', tone: 'success' },
}

export const unitStatusLabels: Record<UnitStatus, StatusMeta> = {
  tersedia: { label: 'Tersedia', tone: 'success' },
  reserved: { label: 'Reserved', tone: 'info' },
  terjual: { label: 'Terjual', tone: 'neutral' },
}

export const paymentStatusLabels: Record<PaymentStatus, StatusMeta> = {
  lunas: { label: 'Lunas', tone: 'success' },
  belum_lunas: { label: 'Belum lunas', tone: 'danger' },
}

export const transactionTypeLabels: Record<TransactionType, StatusMeta> = {
  servis: { label: 'Servis', tone: 'info' },
  barang: { label: 'Barang', tone: 'warning' },
  motor: { label: 'Motor', tone: 'success' },
}

export const stockStatusLabels: Record<StockStatus, StatusMeta> = {
  aman: { label: 'Aman', tone: 'success' },
  menipis: { label: 'Menipis', tone: 'warning' },
  habis: { label: 'Habis', tone: 'danger' },
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  tunai: 'Tunai',
  transfer: 'Transfer',
  qris: 'QRIS',
  kartu: 'Kartu',
}

export const movementTypeLabels: Record<StockMovementType, string> = {
  in: 'Masuk',
  out: 'Keluar',
  adjustment: 'Penyesuaian',
}
