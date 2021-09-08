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
    color: '#e83e8c',
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
    color: '#20c997',
    class: ' bg-teal tx-white'
  },
  {
    key: 'titip',
    name: 'Dititipkan',
    color: '',
    class: 'primary'
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
    class: ' bg-pink tx-white'
  },
  {
    key: 'problem',
    name: 'Pesanan Bermasalah',
    color: '#6f42c1',
    class: 'dark'
  }
]
