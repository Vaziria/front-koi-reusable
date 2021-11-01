import { Diskusi } from '../model/diskusi'
import { sellerDiskusisCol, QuerySnapshot, QueryCallback, DocData, FireError, sellerRepliessCol } from '../utils/firebaseCollection'
import { errorLog } from '../utils/logger'

export async function getSellerDiskusi (shopid: string): Promise<Diskusi[]> {
  const diskusis: Diskusi[] = []
  const data = await sellerDiskusisCol(shopid)
    .orderBy('last_reply', 'desc')
    .get()

  data.docs.forEach(diskusi => {
    if (diskusi.exists) {
      diskusis.push(diskusi.data() as Diskusi)
    }
  })

  return diskusis
}

export async function getReplies (shopid: string, diskusiid: string): Promise<Diskusi[]> {
  const diskusis: Diskusi[] = []
  const data = await sellerDiskusisCol(shopid)
    .where('id', '==', diskusiid)
    .get()

  if (data.docs[0].exists) {
    const replies = await data.docs[0]
      .ref
      .collection('replies')
      .orderBy('created')
      .get()

    replies.docs.forEach(diskusi => {
      if (diskusi.exists) {
        diskusis.push(diskusi.data() as Diskusi)
      }
    })
  }

  return diskusis
}

class SubDiskusi {
  constructor (shopid: string) {
    this.shopid = shopid
  }

  shopid = ''

  onNext (snap: QuerySnapshot<DocData>, callback: QueryCallback<Diskusi>): void {
    snap.docChanges().forEach(change => {
      const notif = change.doc.data() as Diskusi
      callback(change.type, notif)
    })
  }

  onError (err: FireError): void {
    errorLog(err)
  }
}

export class SubscribeDiskusi extends SubDiskusi {
  subDiskusi = (): void => undefined

  subscribe (callback: QueryCallback<Diskusi>): void {
    this.subDiskusi = sellerDiskusisCol(this.shopid)
      .onSnapshot((snap) => this.onNext(snap, callback), this.onError)
  }

  unsubscribe (): void {
    this.subDiskusi()
  }
}

export class SubscribeReply extends SubDiskusi {
  subReplies = (): void => undefined

  async subscribe (callback: QueryCallback<Diskusi>): Promise<void> {
    this.subReplies = sellerRepliessCol(this.shopid)
      .onSnapshot((snap) => this.onNext(snap, callback), this.onError)
  }

  unsubscribe (): void {
    this.subReplies()
  }
}
