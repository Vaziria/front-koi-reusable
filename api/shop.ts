import client from './client'

export async function listShop (query: unknown): Promise<unknown> {
  const data = await client.get('/shop/list', { params: query })
  return data
}

export async function getShop (id: string): Promise<unknown> {
  const data = await client.get('/shop/' + id)
  return data
}
