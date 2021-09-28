/* eslint-disable camelcase */
import firebase from 'firebase'
import { Notif, NotifType } from '../model/notif'
import { BasicNotifType, BuyerNotifType, INotif, SellerNotifType } from '../model/notifs'
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

function getNotifUser (userid: string): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
  return firebase
    .firestore()
    .collection('Users')
    .doc(userid)
    .collection('notifications')
}

function getNotifPublic (): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
  return firebase
    .firestore()
    .collection('NotifHist')
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

export class RequestNotif {
  limit = 10

  reqNotif: firebase.firestore.Query<firebase.firestore.DocumentData> | null = null
  lastVisible: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData> | null = null

  requestUser (userid: string, types: (SellerNotifType | BuyerNotifType)[]): void {
    this.reqNotif = getNotifUser(userid)
      .where('type', 'in', types)
      .orderBy('created', 'desc')
      .limit(this.limit)
  }

  requestPublic (types: (SellerNotifType | BuyerNotifType)[]): void {
    this.reqNotif = getNotifPublic()
      .where('type', 'in', types)
      .orderBy('created', 'desc')
      .limit(this.limit)
  }

  async getNotif (): Promise<NotifData[]> {
    if (this.reqNotif) {
      const notif = await this.reqNotif.get()
      this.lastVisible = notif.docs[notif.docs.length - 1]

      return notif.docs
        .map(data => data.data() as NotifData)
    }

    return []
  }

  async nextNotif (): Promise<NotifData[]> {
    if (this.reqNotif && this.lastVisible) {
      const notif = await this.reqNotif.startAfter(this.lastVisible).get()
      this.lastVisible = notif.docs[notif.docs.length - 1]

      return notif.docs
        .map(data => data.data() as NotifData)
    }

    return []
  }
}
