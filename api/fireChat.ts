/* eslint-disable camelcase */
import firebase from 'firebase'
import { Chat, UserChat } from '../model/chat'
import { IUser } from '../model/user'
import { chatsBuyerCol, chatsSellerCol, FireReq, UserCol } from '../utils/firebaseCollection'
import { errorLog, specialLog } from '../utils/logger'

export type FireChatPayload = {
  sellerid: string
  userid:string
  csid?: string
}
export type DocData = firebase.firestore.DocumentData
export type StoreQuery<T> = firebase.firestore.Query<T>
export type DocumentSnapData = firebase.firestore.QueryDocumentSnapshot<DocData>
export type QuerySnapData = firebase.firestore.QuerySnapshot<DocData>

type ContactCallback = (type: firebase.firestore.DocumentChangeType, chat: UserChat) => void
type ChatCallback = (chat: Chat) => void

export function initSellerContacts (sellerid: string, csid?: string): StoreQuery<DocData> {
  specialLog('Init seller contacts')
  let collection = chatsSellerCol(sellerid).orderBy('last_chat', 'asc')

  if (csid) {
    collection = collection.where('cs_id', '==', csid)
  }

  return collection
}

export function initBuyerContacts (userid: string): StoreQuery<DocData> {
  specialLog('Init buyer contacts')
  return chatsBuyerCol(userid)
    .orderBy('last_chat', 'asc')
}

export function subscribeContact (collection: StoreQuery<DocData>, callback: ContactCallback): () => void {
  function onNext (snap: QuerySnapData): void {
    snap.docChanges().forEach(change => {
      const msg = change.doc.data() as UserChat
      msg.id = change.doc.id
      callback(change.type, msg)
    })
  }

  function onError (err: firebase.firestore.FirestoreError): void {
    errorLog(err)
  }

  return collection.onSnapshot(onNext, onError)
}

export function initChats (payload: FireChatPayload): StoreQuery<DocData> {
  const { sellerid, userid, csid } = payload
  specialLog('Init chat targetid:', sellerid)
  let collection = chatsSellerCol(sellerid)
    .doc(userid)
    .collection('messages')
    .where('created', '>', Date.now())

  if (csid) {
    collection = collection.where('cs_id', '==', csid)
  }

  return collection
    .orderBy('created', 'desc')
    .limit(20)
}

export function subscribeChat (payload: FireChatPayload, callback: ChatCallback): () => void {
  const chatCollection = initChats(payload)

  function onNext (snap: QuerySnapData): void {
    snap.docChanges().forEach(change => {
      const msg = change.doc.data() as Chat
      msg.id = change.doc.id
      callback(msg)
      specialLog('msg from seller', msg)
    })
  }

  function onError (err: firebase.firestore.FirestoreError): void {
    errorLog(err)
  }

  return chatCollection.onSnapshot(onNext, onError)
}

class ChatRequest {
  limit = 20

  chatCol: FireReq|null = null
  lastVisible: DocumentSnapData|null = null
  haveNext = true

  checkNext (docs: DocumentSnapData[]): void {
    this.lastVisible = docs[docs.length - 1]
    this.haveNext = docs.length === this.limit
  }

  get request (): StoreQuery<DocData> | undefined {
    return this.chatCol
      ?.limit(this.limit)
  }
}

abstract class ContactRequest extends ChatRequest {
  abstract contactUserInfo (contact: UserChat): Promise<UserChat>

  async setContacts (contacts:UserChat[], snapData: DocumentSnapData[]): Promise<UserChat[]> {
    await Promise.all(snapData.map(async (contactSnap) => {
      if (contactSnap.exists) {
        const contact = contactSnap.data() as UserChat
        contact.id = contactSnap.id
        const userContact = await this.contactUserInfo(contact)
        contacts.push(userContact)
      }
    }))

    return contacts
  }

  async getContact (): Promise<UserChat[]> {
    const contacts:UserChat[] = []

    if (this.request) {
      const request = await this.request.get()
      this.checkNext(request.docs)
      await this.setContacts(contacts, request.docs)
    }

    return contacts
  }

  async paginateChat (): Promise<UserChat[]> {
    const contacts: UserChat[] = []

    if (this.request && this.lastVisible) {
      const request = await this.request
        .startAfter(this.lastVisible)
        .get()
      this.checkNext(request.docs)
      await this.setContacts(contacts, request.docs)
    }

    return contacts
  }
}

export class ChatBuyerContact extends ContactRequest {
  limit = 20

  constructor (userid: string) {
    super()
    this.chatCol = chatsBuyerCol(userid)
  }

  async contactUserInfo (contact: UserChat): Promise<UserChat> {
    const getUser = await UserCol().doc(contact.id).get()

    if (getUser.exists) {
      const user = getUser.data() as IUser
      contact = {
        ...contact,
        ...user
      }
    }

    return contact
  }
}

export class ChatMessages extends ChatRequest {
  chatCol: FireReq
  limit = 20

  constructor (payload: FireChatPayload) {
    super()
    const { userid, sellerid } = payload
    this.chatCol = chatsSellerCol(sellerid)
      .doc(userid)
      .collection('messages')
  }

  async getChat (): Promise<Chat[]> {
    const messages: Chat[] = []

    if (this.request) {
      const request = await this.request.get()
      this.checkNext(request.docs)

      request.docs.forEach(chat => {
        if (chat.exists) {
          messages.push(chat.data() as Chat)
        }
      })
    }

    return messages
  }

  async paginateChat (): Promise<Chat[]> {
    const messages: Chat[] = []
    console.log(this.lastVisible)
    if (this.request && this.lastVisible) {
      const request = await this.request
        .startAfter(this.lastVisible)
        .get()
      this.checkNext(request.docs)

      request.docs.forEach(chat => {
        if (chat.exists) {
          messages.push(chat.data() as Chat)
        }
      })
    }

    return messages
  }
}
