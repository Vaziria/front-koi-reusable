import firebase from 'firebase'
import { CartIkan, IkanChart, PublicIkan } from '../model/ikan'
import { IUser, PublicUser } from '../model/user'
import client from './client'

export async function getUser (userid: string): Promise<PublicUser> {
  const snap = await firebase.firestore().collection('Users').doc(userid).get()
  const userdata: PublicUser = snap.data() as PublicUser
  return userdata
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
  name: string,
  kota: string,
  phone: string,
  email?: string
}
export async function editProfile (payload: EditPayload): Promise<{ msg: string }> {
  const res = await client.post('/edit_profile', payload)

  return res.data
}

export async function editBuyer (payload: Partial<IUser>): Promise<unknown> {
  const data = await client.put('/user/edit_info', payload)
  return data.data
}

export async function getWishlist (): Promise<PublicIkan[]> {
  const req = await client.get('/wishlist')
  return req.data.data
}

export async function getCarts (): Promise<CartIkan[]> {
  const req = await client.get('/chart')
  return req.data.charts
}
