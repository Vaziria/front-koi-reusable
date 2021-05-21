/* eslint-disable camelcase */
import firebase from 'firebase'

import { db } from '@/utils/firebase'
import { Diskusi, IDiskusi, DiskusiKey } from '../model/diskusi'
import client from './client'

export function diskusiCol (shopid: string, ikanid: string): firebase.firestore.CollectionReference<firebase.firestore.DocumentData> {
  return db.collection('Sellers').doc(shopid).collection('ikans').doc(ikanid).collection('diskusi')
}

export async function getDiskusiIkan (shopid: string, ikanid: string): Promise<IDiskusi[]> {
  const res = await client.get('/diskusi', {
    params: {
      ikanid,
      shopid
    }
  })

  const data = res.data.data

  return data.map((diskusi: IDiskusi) => {
    if (!diskusi.replies) {
      diskusi.replies = []
    }
    return diskusi
  })
}

export async function getDiskusi (shopid: string, has_reply = false): Promise<Diskusi[]> {
  console.log('getting diskusi')

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
export async function sendDiskusi (shopid: string, ikanid: string, data: DiskusiPayload, seller?: boolean): Promise<{
  msg: string
  data: Diskusi
}> {
  const params: {
    shopid: string,
    ikanid: string,
    seller?: boolean
  } = {
    shopid,
    ikanid,
    seller
  }

  const res = await client.post('/diskusi', data, {
    params
  })
  return res.data
}
