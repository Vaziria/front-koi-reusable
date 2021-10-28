import firebase from 'firebase'
import { INotif } from '../model/notifs'
import { publicNotifsCol, userNotifsCol } from '../utils/firebaseCollection'
import { errorLog, specialLog } from '../utils/logger'

type DocData = firebase.firestore.DocumentData
type StoreQuery<T> = firebase.firestore.Query<T>
type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>
type QueryDocSnapshot<T> = firebase.firestore.QueryDocumentSnapshot<T>

type NotifCallback<T> = (type: firebase.firestore.DocumentChangeType, notif: T) => void

export const buyerTransaksiTypes: INotif['type'][] = [
  'titip_order',
  'confirm_order',
  'process_order',
  'karantina_order',
  'dikirim',
  'cancel_order'
]

export const sellerTransaksiTypes: INotif['type'][] = [
  'new_order',
  'unverify_paid',
  'selesai',
  'submit_cancel_order',
  'cancel_order'
]

function unreadNotif (userid: string): StoreQuery<DocData> {
  return userNotifsCol(userid)
    .where('unread', '==', true)
}

export async function diskusiUnread (userid: string): Promise<number> {
  const notif = await unreadNotif(userid)
    .where('type', '==', 'diskusi')
    .get()

  return notif.size
}

export async function transaksiUnread (userid: string, isSeller?: boolean): Promise<number> {
  let request = unreadNotif(userid)
    .where('type', 'in', buyerTransaksiTypes)

  if (isSeller) {
    request = unreadNotif(userid)
      .where('type', 'in', sellerTransaksiTypes)
  }

  const notif = await request.get()

  return notif.size
}

export class RequestNotif {
  limit = 10

  reqNotif: StoreQuery<DocData> | null = null
  lastVisible: QueryDocSnapshot<DocData> | null = null

  requestUser (userid: string, types: INotif['type'][]): void {
    this.reqNotif = userNotifsCol(userid)
      .where('type', 'in', types)
      .orderBy('created', 'desc')
      .limit(this.limit)
  }

  requestPublic (types: INotif['type'][]): void {
    this.reqNotif = publicNotifsCol()
      .where('type', 'in', types)
      .orderBy('created', 'desc')
      .limit(this.limit)
  }
}

export class NotifSubscribe<TNotif> extends RequestNotif {
  subNotif: () => void = () => {
    return undefined
  }

  onNext (snap: QuerySnapshot<DocData>, callback: NotifCallback<TNotif>): void {
    snap.docChanges().forEach(change => {
      const notif = change.doc.data() as TNotif & { id: string }
      notif.id = change.doc.id
      specialLog('getting notif from sub', notif)
      callback(change.type, notif)
    })
  }

  onError (err: firebase.firestore.FirestoreError): void {
    errorLog(err)
  }

  subscribe (callback: NotifCallback<TNotif>): void {
    specialLog('Init buyer notifs')
    if (this.reqNotif) {
      this.reqNotif.onSnapshot((snap) => this.onNext(snap, callback), this.onError)
    }
  }

  unsubscribe (): void {
    this.subNotif()
  }
}

export class NotifData<TNotif> extends RequestNotif {
  async getNotif (): Promise<TNotif[]> {
    if (this.reqNotif) {
      const notif = await this.reqNotif.get()
      this.lastVisible = notif.docs[notif.docs.length - 1]

      return notif.docs
        .map(data => data.data() as TNotif)
    }

    return []
  }

  async nextNotif (): Promise<TNotif[]> {
    if (this.reqNotif && this.lastVisible) {
      const notif = await this.reqNotif.startAfter(this.lastVisible).get()
      this.lastVisible = notif.docs[notif.docs.length - 1]

      return notif.docs
        .map(data => data.data() as TNotif)
    }

    return []
  }
}
