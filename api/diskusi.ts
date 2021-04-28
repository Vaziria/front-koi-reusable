/* eslint-disable camelcase */
import firebase from 'firebase'

import { db } from '@/utils/firebase'
import { Diskusi, DiskusiKey } from '../model/diskusi'
import client from './client'

export function diskusiCol (shopid: string, ikanid: string): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
  return db.collection('Sellers').doc(shopid).collection('ikans').doc(ikanid).collection('diskusi')
}

export async function getDiskusi (shopid: string, has_reply = false): Promise<Diskusi[]> {
  const key: DiskusiKey = 'shopid'
  const has_reply_key: DiskusiKey = 'has_reply'
  const orderType: DiskusiKey = 'created'
  const snap = await db.collectionGroup('diskusi').where(key, '==', shopid).where(has_reply_key, '==', has_reply).orderBy(orderType, 'desc').get()

  const hasil: Diskusi[] = []
  snap.forEach((doc) => {
    const diskusi: Diskusi = doc.data() as Diskusi
    hasil.push(diskusi)
  })

  return hasil
}

type DiskusiPayload = Pick<Diskusi, 'image' | 'text' | 'reply_id'>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendDiskusi (shopid: string, ikanid: string, data: DiskusiPayload): Promise<{
  msg: string
  data: Diskusi
}> {
  const res = await client.post('/diskusi', data, {
    params: {
      shopid,
      ikanid
    }
  })
  return res.data
}
