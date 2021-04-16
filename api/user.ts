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
