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

function cleanparams<T> (params: IkanFilter): T {
  const data = Object.fromEntries(Object.entries(params).filter(([_, v]) => {
    return !((v === undefined) || (v === null) || (v === 0) || (v === []) || (v === ''))
  }))
  return data as T
}

export async function publicIkan (params?: IkanFilter): Promise<IIkan[]> {
  params = cleanparams<IkanFilter>(params || {})
  const res = await client.get('/public/ikan', {
    params
  })
  console.log(res.data)
  return res.data
}
