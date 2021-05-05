/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { IIkan, PublicIkan } from '../model/ikan'
import client from './client'
import { IkanFilter } from './product'

export async function listIkan (params = { kategori: 'Asagi' }) {
  const data = await client.get('/ikan/list', {
    params
  })
  return data.data
}

export async function createIkan (data: any) {
  const res = await client.post('/ikan/create', data)
  return res
}

export async function createLelang (data: any) {
  const res = await client.post('/ikan/create?bidable=true', data)
  return res
}

export async function deleteIkan (id: string, params = {}) {
  const res = await client.delete(`/ikan/${id}`, {
    params
  })
  return res
}

export async function getIkan (id: string): Promise<IIkan> {
  const res = await client.get(`/ikan/${id}`)
  return res.data
}

export async function updateParsialIkan (id: string, data: Partial<IIkan>) : Promise<void> {
  await client.put(`/ikan/update/${id}`, data)
}

export async function updateIkan (id: string, data: any) {
  const res = await client.put(`/ikan/update/${id}`, data)
  return res
}

// public

export async function publicListIkans (params: IkanFilter): Promise<IIkan[]> {
  const res = await client.get('/public/ikan', { params })
  return res.data
}

export async function publicListIkan (query: any): Promise<IIkan[]> {
  const res = await client.get('/public/ikan', { params: query })
  return res.data
}

export async function publicGetIkan (shopid: string, id: string): Promise<PublicIkan> {
  const res = await client.get(`/public/ikan/${shopid}/${id}`)
  return res.data
}
