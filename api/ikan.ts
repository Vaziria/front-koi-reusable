/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import client from "./client"

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

export async function getIkan (id: string) {
  const res = await client.get(`/ikan/${id}`)
  return res
}

export async function updateIkan (id: string, data: any) {
  const res = await client.put(`/ikan/update/${id}`, data)
  return res
}

// public

export async function publicListIkan (query: any) {
  const res = await client.get('/public/ikan', { params: query })
  return res
}

export async function publicGetIkan (id: string) {
  const res = await client.get(`/public/ikan/${id}`)
  return res
}
