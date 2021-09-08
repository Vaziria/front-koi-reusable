/* eslint-disable camelcase */
import { Order, PaidStatus, StatusOrder } from '../model/order'
import client from './client'
import { getAllStatus } from '../mock/order'
import { isMock, delay } from '../mock'

interface FilterPageOrder {
  q: string
  status: StatusOrder | ''
  pay_status: PaidStatus | ''
  datemin: number
  datemax: number
  offset: number
  limit: number
  order_type: 'desc' | 'asc'
  order: 'created'
  csid: string
  target_kirim_min?: number
  target_kirim_max?: number
}

interface IBuktiPembayaran {
  image: string
  shopid: string
  orderid: string
}

export const kurirType = ['bis', 'pesawat', 'travel'] as const
export type IKurirType = typeof kurirType[number]
export interface IShippingData {
  type: IKurirType
  resi?: string
  resi_media?: string[]
  kurir_contact?: string
}

export async function listOrder (query: Partial<FilterPageOrder>): Promise<Order[]> {
  if (isMock()) {
    const { status, pay_status } = query
    await delay(2000)
    return getAllStatus(status, pay_status)
  }

  const data = await client.get('/seller/order/list', { params: query })
  return data.data
}

export async function deleteOrder (id: string): Promise<void> {
  await client.delete(`/order/${id}`)
}

export async function getOrder (id: string): Promise<Order> {
  const res = await client.get(`/order/${id}`)
  return res.data
}

export async function updateOrder (orderid: string, data: Partial<Order>): Promise<Order> {
  const res = await client.post('/seller/update_order', data, { params: { orderid } })
  return res.data
}

export async function setOngkir (id: string, ongkir: number): Promise<Order> {
  const res = await client.put('seller/order/set_ongkir', { ongkir: ongkir }, { params: { orderid: id } })
  return res.data
}

export async function acceptOrder (orderid: string, ongkir: number): Promise<Order> {
  const data = await client.put('/seller/accept_order', { ongkir }, { params: { orderid } })
  return data.data
}

export async function cancelOrder (reason: string, query: { oid: string, shopid: string }): Promise<Order> {
  const data = await client.put('/buyer/cancel_order', { reason: reason }, { params: query })
  return data.data
}

export async function finishOrder (query: { oid: string, shopid: string }): Promise<Order> {
  const data = await client.put('/buyer/finish_order', null, { params: query })
  return data.data
}

export async function invoice (query: { shopid: string, oid: string }): Promise<Order> {
  // console.log(query)
  const res = await client.get('/invoice', { params: query })
  return res.data.data
}

export async function buktiPembayaran (payload: IBuktiPembayaran): Promise<void> {
  await client.post('/buyer/bukti_pembayaran', payload)
}

export async function setShipping (orderid: string, payload: IShippingData): Promise<void> {
  await client.put('/order/update_shipping', payload, { params: { orderid } })
}
