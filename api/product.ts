/* eslint-disable camelcase */
import { IIkan, IkanKey } from '@/reusable/model/ikan'
import client from './client'

export interface IkanFilter {
  bidable?: boolean
  rating?: number
  pmin?: number
  pmax?: number
  seller_id?: string
  kategori?: string
  kota?: string[] | string
  name?: string
  order?: IkanKey
  order_type?: 'asc' | 'desc',
  limit?: number
  offset?: number
}

export async function publicIkan (params?: IkanFilter): Promise<IIkan[]> {
  const res = await client.get('/public/ikan', {
    params
  })
  console.log(res.data)
  return res.data
}
