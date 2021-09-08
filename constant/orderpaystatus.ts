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
    name: 'Belum Bayar',
    color: '#cdd4e0',
    class: 'light'
  },
  {
    key: 'unverify',
    name: 'Menunggu Verifikasi',
    color: '#7987a1',
    class: 'secondary'
  },
  {
    key: 'paid',
    name: 'Lunas',
    color: '#007bff',
    class: 'primary'
  }
]
