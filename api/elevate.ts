import client, { StdRes } from './client'

export interface AddRootPayload {
    type: 'phone' | 'email'
    user: string
    pass: string
}

export async function addRoot (payload: AddRootPayload): Promise<StdRes> {
  const res = await client.post('/internal/setup_root', payload)
  return res.data
}
