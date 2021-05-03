import { StatusOrder } from '../model/order'

export interface MapValue {
    key: StatusOrder
    name: string
    color: string
    class: string
}

export const orderStatus: MapValue[] = [
  {
    key: 'pending',
    name: 'Pending',
    color: '#e83e8c',
    class: ' bg-pink tx-white'
  },
  {
    key: 'waitverif',
    name: 'Menunggu Konfirmasi',
    color: '#e83e8c',
    class: ' bg-pink tx-white'
  },
  {
    key: 'process',
    name: 'Diproses',
    color: '#20c997',
    class: ' bg-teal tx-white'
  },
  {
    key: 'dikirim',
    name: 'Dikirim',
    color: '#20c997',
    class: ' bg-teal tx-white'
  },
  {
    key: 'selesai',
    name: 'Pesanan Tiba',
    color: '#28a745',
    class: 'success'
  },
  {
    key: 'cancel',
    name: 'Pesanan Batal',
    color: '#dc3545',
    class: 'danger'
  },
  {
    key: 'submit_cancel',
    name: 'Pengajuan Cancel',
    color: '#6610f2',
    class: ' bg-indigo tx-white'
  },
  {
    key: 'problem',
    name: 'Pesanan Bermasalah',
    color: '#6f42c1',
    class: ' bg-purple tx-white'
  }
]
