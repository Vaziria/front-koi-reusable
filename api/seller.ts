/* eslint-disable camelcase */
import firebase from 'firebase'
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

export function sellerGeneral (sellerid: string): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
  return firebase
    .firestore()
    .collection('Sellers')
    .doc(sellerid)
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
