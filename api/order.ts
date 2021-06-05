import { Order, PaidStatus, StatusOrder } from '../model/order'
import client from './client'

interface FilterPageOrder {
  q: string
  status: StatusOrder | ''
  // eslint-disable-next-line camelcase
  pay_status: PaidStatus | ''
  datemin: number
  datemax: number
  offset: number
  limit: number
  // eslint-disable-next-line camelcase
  order_type: 'desc' | 'asc'
  order: 'created'
  csid: string
  // eslint-disable-next-line camelcase
  target_kirim_min?: number
  // eslint-disable-next-line camelcase
  target_kirim_max?: number
}

interface IBuktiPembayaran {
  image: string
  shopid: string
  orderid: string
}

export async function listOrder (query: Partial<FilterPageOrder>): Promise<Order[]> {
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

export async function updateOrder (id: string, data: Partial<Order>): Promise<Order> {
  const res = await client.put(`/order/${id}`, data)
  return res.data
}

export async function setOngkir (id: string, ongkir: number): Promise<Order> {
  const res = await client.put('seller/order/set_ongkir', { ongkir: ongkir }, { params: { orderid: id } })
  return res.data
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

export async function buktiPembayaran(payload: IBuktiPembayaran): Promise<void> {
  const res = await client.post('/buyer/bukti_pembayaran', payload)
}
