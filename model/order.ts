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

export const listStatusOrder = ['waitverif', 'submit_cancel', 'pending', 'process', 'dikirim', 'selesai', 'cancel', 'problem'] as const
export type StatusOrder = typeof listStatusOrder[number];

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
  address: Address
  cancel_reason:string
  created: number
  note_admin: string
  note: string
  target_kirim: number
  resi?: string
  from_bid?: boolean
  bukti_pembayaran?: string
}
