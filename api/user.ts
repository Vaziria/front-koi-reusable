import { IkanChart } from '../model/product'
import { IUser, PublicUser } from '../model/user'
import client from './client'

export async function getUser (userid: string): Promise<PublicUser> {
  const res = await client.get(`/user/${userid}`)
  return res.data.data
}

interface CartRes {
    buyer: IUser,
    charts: IkanChart[]
}

export async function cartList (): Promise<CartRes> {
  const res = await client.get('/chart')
  return res.data
}

interface EditPayload {
  kota: string
  name: string
}
export async function editProfile (payload: EditPayload): Promise<{ msg: string }> {
  const res = await client.post('/edit_profile', payload)

  return res.data
}
