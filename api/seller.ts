import client, { StdRes } from './client'

export interface AddSellerPayload {
    type: 'phone' | 'email'
    user: string
    pass: string
}

export async function addSeller (payload: AddSellerPayload): Promise<StdRes> {
  const res = await client.post('/internal/seller', payload)
  return res.data
}
