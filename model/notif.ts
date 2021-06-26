/* eslint-disable camelcase */
export type NotifType = 'update_order' | 'new_order' | 'create_produk' | 'ikan' | 'diskusi' | 'promo' | 'new_chat' | 'system'

export interface NotifHist {
    id?: string
    title: string
    created: number
    type: NotifType
    body?: string
    unread?: boolean
}

export interface NotifDiskusi extends NotifHist {
  type: 'diskusi'
  ikan_id: string
  shopid: string
  userid: string
}

export interface NotifIkan extends NotifHist {
  type: 'ikan' | 'create_produk'
  name: string
  ikan_id: string
  gambar: string
  kategori: string
  price: string
  ukuran: string
  seller_name: string
  seller_id: string
}

export interface NotifOrder extends NotifHist {
  type: 'update_order' | 'new_order'
  order_id: string
  shop_id: string
}

export interface NotifChat extends NotifHist {
  type: 'new_chat'
  text: string
  to_id: string
  from_id: string
}

export interface NotifSystem extends NotifHist {
  type: 'system'
}

export type Notif = NotifIkan | NotifDiskusi | NotifOrder | NotifChat | NotifSystem
