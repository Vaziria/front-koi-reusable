import { Seller } from '../model/seller'
import client, { StdRes } from './client'

export interface AddSellerPayload {
    type: 'phone' | 'email'
    user: string
    pass: string
}

export async function findSeller (params: { q: string }): Promise<{ data: Seller[] }> {
  const res = await client.get('/internal/sellers', {
    params
  })
  return res.data
}

export async function getSeller (id: string): Promise<Seller> {
  const res = await client.get(`/shop/${id}`)
  return res.data
}

export async function addSeller (payload: AddSellerPayload): Promise<StdRes> {
  const res = await client.post('/internal/seller', payload)
  return res.data
}
