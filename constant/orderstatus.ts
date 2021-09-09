import { StatusOrder } from '../model/order'

export interface MapValue {
    key: StatusOrder
    name: string
    color: string
    class: string
}

export const orderStatus: MapValue[] = [
  {
    key: 'waitverif',
    name: 'Menunggu Konfirmasi',
    color: '#ffc107',
    class: 'warning'
  },
  {
    key: 'pending',
    name: 'Belum Bayar',
    color: '#e83e8c',
    class: 'light'
  },
  {
    key: 'process',
    name: 'Diproses',
    color: '#00cccc',
    class: ' bg-teal tx-white'
  },
  {
    key: 'dikirim',
    name: 'Dikirim',
    color: '#17a2b8',
    class: ' bg-info-real tx-white'
  },
  {
    key: 'selesai',
    name: 'Selesai',
    color: '#3bb001',
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
    color: '#f10075',
    class: ' bg-pink tx-white'
  },
  {
    key: 'problem',
    name: 'Pesanan Bermasalah',
    color: '#3b4863',
    class: 'dark'
  }
]
