import { PaidStatus } from '../model/order'

export interface MapValue {
  key: PaidStatus
  name: string
  color: string
  class: string
}

export const orderPayStatus: MapValue[] = [
  {
    key: 'unpaid',
    name: 'Menunggu Pembayaran',
    color: '#7987a1',
    class: 'secondary'
  },
  {
    key: 'unverify',
    name: 'Menunggu Verifikasi',
    color: '#20c997',
    class: ' bg-teal tx-white'
  },
  {
    key: 'paid',
    name: 'Sudah Bayar',
    color: '#007bff',
    class: 'primary'
  }
]
