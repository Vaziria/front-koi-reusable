/* eslint-disable camelcase */
import firebase from 'firebase'

import { db } from '../../utils/firebase'
import { Diskusi, IDiskusi, DiskusiKey } from '../model/diskusi'
import client from './client'
import { IIkan } from '../model/ikan'

export type HistoryDiskusiRes = Diskusi & IIkan

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

export async function getDiskusi (shopid: string, replied = false): Promise<Diskusi[]> {
  // console.log('getting diskusi')

  const key: DiskusiKey = 'shopid'
  const replied_key: DiskusiKey = 'replied'
  const orderType: DiskusiKey = 'created'
  const snap = await db.collectionGroup('diskusi')
    .where(key, '==', shopid)
    .where(replied_key, '==', replied)
    .orderBy(orderType, 'desc').get()

  const hasil: Diskusi[] = []
  snap.forEach((doc) => {
    const diskusi: Diskusi = doc.data() as Diskusi
    hasil.push(diskusi)
  })

  return hasil
}

export async function getHistoryDiskusi (uid: string): Promise<HistoryDiskusiRes[]> {
  const hists: Diskusi[] = []

  const snap = await db
    .collection('Users')
    .doc(uid)
    .collection('ikan_diskusi')
    .limit(20)
    .get()

  snap.forEach(doc => {
    hists.push(doc.data() as Diskusi)
  })

  const hasil: HistoryDiskusiRes[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const task: Promise<any>[] = hists.map(async (hist) => {
    const snap = await db
      .collection('Sellers')
      .doc(hist.shopid)
      .collection('ikans')
      .doc(hist.ikanid)
      .get()

    if (snap.exists) {
      hasil.push({ ...hist, ...snap.data() as IIkan })
    }
  })

  await Promise.all(task)
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
