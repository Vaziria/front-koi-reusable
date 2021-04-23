/* eslint-disable camelcase */
import { IIkan, IkanKey, PublicIkan } from '@/reusable/model/ikan'
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export async function publicIkanItem(id: string): Promise<PublicIkan> {
  const res = await client.get(`/ikan/${id}`)
  return res.data
}

export async function addWish (id: string): Promise<any> {
  const res = await client.put(`/addwish/${id}`)
  return res
}

export async function removeWish (id: string): Promise<any> {
  const res = await client.delete(`/removewish/${id}`)
  return res
}

export async function addChart (id: string, quantity: number = 1): Promise<any> {
  const res = await client.put(`/chart/${id}`, {
    quantity
  })
  return res
}

export async function removeChart (id: string): Promise<any> {
  const res = await client.delete(`/chart/${id}`)
  return res
}


