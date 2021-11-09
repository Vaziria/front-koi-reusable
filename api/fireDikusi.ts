import { Diskusi } from '../model/diskusi'
import { sellerDiskusisCol, QuerySnapshot, QueryCallback, DocData, FireError, sellerRepliessCol, buyerDiskusisCol } from '../utils/firebaseCollection'
import { errorLog } from '../utils/logger'

export async function getSellerDiskusi (shopid: string, replied?: boolean): Promise<Diskusi[]> {
  const diskusis: Diskusi[] = []
  let request = sellerDiskusisCol(shopid)
    .orderBy('last_reply', 'desc')

  if (typeof replied === 'boolean') {
    request = request.where('replied', '==', replied)
  }

  const data = await request.get()

  data.docs.forEach(diskusi => {
    if (diskusi.exists) {
      diskusis.push(diskusi.data() as Diskusi)
    }
  })

  return diskusis
}

export async function getBuyerDiskusi (userid: string, replied?: boolean): Promise<Diskusi[]> {
  const diskusis: Diskusi[] = []
  let request = buyerDiskusisCol(userid)
    .orderBy('last_reply', 'desc')

  if (typeof replied === 'boolean') {
    request = request.where('replied', '==', replied)
  }

  const data = await request.get()

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
  constructor (shopid: string, replied?: boolean) {
    this.shopid = shopid
    this.replied = replied
  }

  replied?: boolean
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
    let request = sellerDiskusisCol(this.shopid)

    if (typeof this.replied === 'boolean') {
      request = request.where('replied', '==', this.replied)
    }

    this.subDiskusi = request
      .onSnapshot((snap) => this.onNext(snap, callback), this.onError)
  }

  unsubscribe (): void {
    this.subDiskusi()
  }
}

export class SubscribeDiskusiIkan extends SubDiskusi {
  constructor (shopid: string, ikanid: string) {
    super(shopid)
    this.ikanid = ikanid
  }

  ikanid = ''

  subDiskusi = (): void => undefined

  subscribe (callback: QueryCallback<Diskusi>): void {
    let request = sellerDiskusisCol(this.shopid)
      .where('ikanid', '==', this.ikanid)

    if (typeof this.replied === 'boolean') {
      request = request.where('replied', '==', this.replied)
    }

    this.subDiskusi = request
      .onSnapshot((snap) => this.onNext(snap, callback), this.onError)
  }

  unsubscribe (): void {
    this.subDiskusi()
  }
}

export class SubscribeReply extends SubDiskusi {
  constructor (shopid: string, ikanid = '') {
    super(shopid)
    this.ikanid = ikanid
  }

  ikanid = ''

  subReplies = (): void => undefined

  async subscribe (callback: QueryCallback<Diskusi>): Promise<void> {
    let request = sellerRepliessCol(this.shopid)

    if (this.ikanid) {
      request = request.where('ikanid', '==', this.ikanid)
    }

    this.subReplies = request
      .onSnapshot((snap) => this.onNext(snap, callback), this.onError)
  }

  unsubscribe (): void {
    this.subReplies()
  }
}
