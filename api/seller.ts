/* eslint-disable camelcase */
import firebase from 'firebase'
import { IReview } from '../model/review'
import { Seller } from '../model/seller'
import client, { StdRes } from './client'

export interface AddSellerPayload {
    type: 'phone' | 'email'
    user: string
    pass: string
}

export type Rekening = {
  bank_name: string
  rek_number: string
  rek_name: string
}

export async function findSeller (params: { q: string }): Promise<{ data: Seller[] }> {
  const res = await client.get('/internal/sellers', {
    params
  })
  return res.data
}

export async function getSeller (id: string): Promise<Seller> {
  const res = await client.get(`/shop/${id}`)
  return res.data
}

export async function addSeller (payload: AddSellerPayload): Promise<StdRes> {
  const res = await client.post('/internal/seller', payload)
  return res.data
}

export function sellerCol (sellerid: string): firebase.firestore.DocumentReference<firebase.firestore.DocumentData> {
  return firebase
    .firestore()
    .collection('Sellers')
    .doc(sellerid)
}

export function sellerGeneral (sellerid: string): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
  return sellerCol(sellerid)
    .collection('general')
}

export async function getRekening (sellerid: string): Promise<Rekening> {
  const rekening = await sellerGeneral(sellerid)
    .doc('rekening')
    .get()

  if (rekening.exists) {
    return rekening.data() as Rekening
  }

  return {
    bank_name: '',
    rek_number: '',
    rek_name: ''
  }
}

export async function setRekening (sellerid: string, payload: Rekening): Promise<void> {
  const general = sellerGeneral(sellerid)
  const rekening = general.doc('rekening')
  const rekeningExist = (await rekening.get()).exists

  if (rekeningExist) {
    await rekening.update(payload)
  } else {
    await rekening.set(payload)
  }
}

export class Testimoni {
  sellerid: string
  limit = 10

  reqTestimoni: firebase.firestore.Query<firebase.firestore.DocumentData> | null = null
  lastVisible: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData> | null = null

  constructor (sellerid: string) {
    this.sellerid = sellerid
  }

  newRequest (): void {
    this.reqTestimoni = sellerCol(this.sellerid)
      .collection('reviews')
      .orderBy('created', 'desc')
      .limit(this.limit)
  }

  async getTestimoni (): Promise<IReview[]> {
    if (this.reqTestimoni) {
      const notif = await this.reqTestimoni.get()
      this.lastVisible = notif.docs[notif.docs.length - 1]

      return notif.docs
        .map(data => data.data() as IReview)
    }

    return []
  }

  async nextTestimoni (): Promise<IReview[]> {
    if (this.reqTestimoni && this.lastVisible) {
      const notif = await this.reqTestimoni.startAfter(this.lastVisible).get()
      this.lastVisible = notif.docs[notif.docs.length - 1]

      return notif.docs
        .map(data => data.data() as IReview)
    }

    return []
  }
}
