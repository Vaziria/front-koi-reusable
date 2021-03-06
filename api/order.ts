/* eslint-disable camelcase */
import { Order, PaidStatus, StatusOrder, ThreatTipe } from '../model/order'
import client from './client'
import { getAllStatus, single } from '../mock/order'
import { isMock, delay } from '../mock'
import { IShippingData } from '../model/shipping'

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
  threat_tipe: ThreatTipe | ''
}

interface IBuktiPembayaran {
  image: string
  shopid: string
  orderid: string
}

function cleanQuery (query: Partial<FilterPageOrder>): Partial<FilterPageOrder> {
  const queryKey: (keyof FilterPageOrder)[] = [
    'q',
    'status',
    'pay_status',
    'datemin',
    'datemax',
    'offset',
    'limit',
    'order_type',
    'order',
    'csid',
    'target_kirim_min',
    'target_kirim_max',
    'threat_tipe'
  ]

  queryKey.forEach(key => {
    if (!query[key]) {
      delete query[key]
    }
  })

  return query
}

export interface ReviewPayload {
  msg: string
  rating: number
  media: string[]
  shopid: string
  orderid: string
  userid: string
}

export async function listOrder (query: Partial<FilterPageOrder>): Promise<Order[]> {
  if (isMock()) {
    const { status, pay_status, threat_tipe } = query
    await delay(2000)
    return getAllStatus(status, pay_status, threat_tipe)
  }

  const data = await client.get('/seller/order/list', { params: cleanQuery(query) })
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

export async function cancelSeller (reason: string, query: { oid: string }): Promise<void> {
  const data = await client.put('/seller/cancel_order', { reason: reason }, { params: query })
  return data.data
}

export async function finishOrder (query: { oid: string, shopid: string }): Promise<Order> {
  const data = await client.put('/buyer/finish_order', null, { params: query })
  return data.data
}

export async function invoice (query: { shopid: string, oid: string }): Promise<Order> {
  if (isMock()) {
    await delay(2000)
    return single()
  }
  const res = await client.get('/invoice', { params: query })
  return res.data.data
}

export async function buktiPembayaran (payload: IBuktiPembayaran): Promise<void> {
  await client.post('/buyer/bukti_pembayaran', payload)
}

export async function setShipping (orderid: string, payload: IShippingData): Promise<void> {
  await client.put('/seller/order/update_shipping', payload, { params: { orderid } })
}

export async function addReview (payload: ReviewPayload): Promise<void> {
  await client.post('/buyer/add_review', payload)
}
