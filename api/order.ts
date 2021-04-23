/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from '../model/order'
import client from './client'

export async function listOrder (query: any) {
  const data = await client.get('/seller/order/list', { params: query })
  return data.data
}

export async function deleteOrder (id: string) {
  const res = await client.delete(`/order/${id}`)
  return res
}

export async function getOrder (id: string) {
  const res = await client.get(`/order/${id}`)
  return res
}

export async function updateOrder (id: string, data: any) {
  const res = await client.put(`/order/${id}`, data)
  return res
}

export async function setOngkir (id: string, ongkir: any) {
  const res = await client.put('seller/order/set_ongkir', { ongkir: ongkir }, { params: { orderid: id } })
  return res
}

export async function cancelOrder (reason: any, query: any) {
  const data = await client.put('/buyer/cancel_order', { reason: reason }, { params: query })
  return data.data
}

export async function finishOrder (query: any) {
  const data = await client.put('/buyer/finish_order', null, { params: query })
  return data.data
}

export async function invoice (query: { shopid: string, oid: string }): Promise<Order> {
  // console.log(query)
  const data = await client.get('/invoice', { params: query })
  return data.data
}
