/* eslint-disable camelcase */
import { Chat } from './chat'

const orderNotifType = ['auto_cancel_order', 'cancel_order', 'new_order', 'unverify_paid', 'selesai', 'submit_cancel_order', 'titip_order', 'confirm_order', 'process_order', 'karantina_order', 'dikirim'] as const

export type OrderNotifType = typeof orderNotifType[number]
export type ChatNotifType = 'new_chat'

export type NotifType = OrderNotifType | ChatNotifType

const basicNotifType = ['system', 'new_chat', 'diskusi', 'auto_cancel_order', 'cancel_order'] as const
const sellerNotifType = ['new_order', 'unverify_paid', 'selesai', 'submit_cancel_order'] as const
const buyerNotifType = ['promo', 'ikan', 'titip_order', 'confirm_order', 'process_order', 'karantina_order', 'dikirim'] as const

export type BasicNotifType = typeof basicNotifType[number]
export type SellerNotifType = typeof sellerNotifType[number] | BasicNotifType
export type BuyerNotifType = typeof buyerNotifType[number] | BasicNotifType

export interface INotifIkan {
  id: string
  type: 'ikan'
  // eslint-disable-next-line camelcase
  ikan_id: string
  // eslint-disable-next-line camelcase
  ikan_name: string
  image: string
  category: string
  price: number
  ukuran: number
  // eslint-disable-next-line camelcase
  seller_name: string
  unread: boolean
  created: number

}

export interface INotifOrder {
  id: string
  title: string
  body: string
  type: OrderNotifType
  shopid: string
  orderid: string
  image: string
  unread: boolean
  created: number
}

export interface INotifChat extends Chat {
  id: string
  type: ChatNotifType
  unread: boolean
  created: number
}

export interface INotifDiskusi {
  id: string
  type: 'diskusi'
  // eslint-disable-next-line camelcase
  ikan_id: string
  shopid: string
  userid: string
  unread: boolean
  created: number
}

export interface INotifSystem {
  id: string
  type: 'system'
  title: string
  body: string
  image?: string
  unread: boolean
  created: number
}

export type INotif = INotifIkan | INotifOrder | INotifChat | INotifDiskusi | INotifSystem
