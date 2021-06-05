import { Seller } from '../model/seller'
import client from './client'

export async function listShop (query: unknown): Promise<unknown> {
  const req = await client.get('/shop/list', { params: query })
  return req.data
}

export async function getShop (id: string): Promise<Seller> {
  const req = await client.get('/shop/' + id)
  return req.data.data
}
