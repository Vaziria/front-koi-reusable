/* eslint-disable camelcase */
import { Notif, NotifType } from '../model/notif'
import { BasicNotifType, INotif } from '../model/notifs'
import client from './client'

interface INotifPayload {
  title: string
  body: string
  type: string
  image: string
}

export interface NotifData {
  id?: string
  title: string
  created: number
  type: INotif
  body?: string
  unread?: boolean
  orderid: string
  shop_id: string
}

export async function pushIkan (id: string): Promise<unknown> {
  const data = await client.get(`/notif/sendikan/${id}`)
  return data.data
}

export async function listNotification (params: { tipe: NotifType }): Promise<Notif[]> {
  const data = await client.get('/notif/list', {
    params
  })
  return data.data.data
}

export async function addNotification (payload: INotifPayload): Promise<unknown> {
  const res = await client.post('/notif/add', payload)
  return res.data.data
}

export async function editNotification (payload: INotifPayload, id: string): Promise<unknown> {
  const data = await client.put(`/notif/${id}`, payload)
  return data.data
}

export async function deleteNotification (id: string): Promise<unknown> {
  const data = await client.delete(`/notif/${id}`)
  return data.data
}

// export async function listNotification(params) {
//   const data = await clientService.get('/notif/list', { params: params })
//   return data.data
// }

export async function readAll (): Promise<void> {
  await client.get('/notif/readall')
}

export async function pushNotification (id: string): Promise<unknown> {
  const data = await client.get(`notif/send/${id}`)
  return data.data
}

export async function publicNotification (params: { tipe: BasicNotifType }): Promise<INotif[]> {
  const data = await client.get('/notif/list', {
    params
  })
  return data.data.data
}
