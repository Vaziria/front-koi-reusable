/* eslint-disable camelcase */
import { IIkan } from './ikan'

export interface Address {
  id?: string
  buyer_name: string
  phone_number: string
  province: string
  region: string // kabupaten dan kota
  district: string // kecamatan
  postal_code: string
  alamat: string

}

export type PayMethod = 'transfer'
export type PaidStatus = 'unpaid' | 'paid' | 'unverify'

export const listStatusOrder = ['waitverif', 'submit_cancel', 'pending', 'process', 'titip', 'dikirim', 'selesai', 'cancel', 'problem'] as const
export type StatusOrder = typeof listStatusOrder[number];

export interface SellerOrder {
  id: string;
  seller_name: string;
  phone: string;
  location: string;
}

export interface BuyerOrder {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string
  shopid: string
  status: StatusOrder
  pay_status: PaidStatus
  ikans: IIkan[]
  sub_total: number
  ongkir: number
  total: number
  diskon: number
  pay_method:PayMethod
  pay_channel: string
  address: Address
  cancel_reason:string
  created: number
  note_admin: string
  note: string
  target_kirim: number
  resi?: string
  from_bid?: boolean
  bukti_pembayaran?: string
  seller: SellerOrder
  buyer: BuyerOrder
}
