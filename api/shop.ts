/* eslint-disable camelcase */
import { Seller } from '../model/seller'
import client from './client'
import { IkanFilter } from './product'

export type Category = {
  key: string
  doc_count: number
}

export type ShopFilter = Pick<IkanFilter, 'name' | 'kota' | 'limit' | 'offset'>

export async function listShop (query: ShopFilter): Promise<Seller[]> {
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

  return req.data.map((item: { key: string }) => {
    return {
      key: item.key,
      name: item.key.charAt(0).toUpperCase() + item.key.slice(1)
    }
  })
}
