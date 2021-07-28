import { Seller } from '../model/seller'
import client from './client'

export type Category = {
  key: string
  doc_count: number
}

export async function listShop (query: { name?: string, offset?: number, limit?: number }): Promise<Seller[]> {
  const req = await client.get('/shop/list', { params: query })
  return req.data
}

export async function getShop (id: string): Promise<Seller> {
  const req = await client.get('/shop/' + id)
  return req.data.data
}

export async function getShopCat (seller_id: string): Promise<Category[]> {
  const params = { seller_id }
  const req = await client.get('public/shop/category', { params })

  return req.data.map((item) => {
    return {
      key: item.key,
      name: item.key.charAt(0).toUpperCase() + item.key.slice(1)
    }
  })
}
