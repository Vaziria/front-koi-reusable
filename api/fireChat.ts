/* eslint-disable camelcase */
import firebase from 'firebase'
import { Chat, UserChat } from '../model/chat'
import { errorLog, specialLog } from '../utils/logger'

export type FireChatPayload = {
  sellerid: string
  userid:string
  csid?: string
}

type FireReq = firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
type DocumentSnapData = firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
type QuerySnapData = firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>

const fire = firebase.firestore()

function chatsSellerCol (sellerid: string): FireReq {
  return fire
    .collection('Sellers')
    .doc(sellerid)
    .collection('seller_chats')
}

// function chatsBuyerCol (user: string): FireReq {
//   return fire
//     .collection('Users')
//     .doc(user)
//     .collection('chats')
// }

export function initBuyerChat (payload: FireChatPayload, callback: (chat: Chat) => void): () => void {
  const { userid, sellerid } = payload
  specialLog('Init buyer chat with seller', sellerid)
  const collection = chatsSellerCol(sellerid)
    .doc(userid)
    .collection('messages')
    .where('created', '>', Date.now())
    .orderBy('created', 'desc')
    .limit(20)

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

  return collection.onSnapshot(onNext, onError)
}

abstract class ChatRequest {
  abstract limit: number

  chatCol?: FireReq
  lastVisible?: DocumentSnapData
  haveNext = true

  checkNext (docs: DocumentSnapData[]): void {
    this.lastVisible = docs[docs.length - 1]
    this.haveNext = docs.length === this.limit
  }

  get requestMessages (): firebase.firestore.Query<firebase.firestore.DocumentData> | undefined {
    return this.chatCol
      ?.limit(this.limit)
  }
}

export class ChatBuyerContact extends ChatRequest {
  limit = 20

  constructor (userid: string) {
    super()
    this.chatCol = chatsSellerCol(userid)
  }

  async getContact (): Promise<UserChat[]> {
    const contacts:UserChat[] = []

    if (this.requestMessages) {
      const request = await this.requestMessages.get()
      this.checkNext(request.docs)

      request.docs.forEach(chat => {
        if (chat.exists) {
          contacts.push(chat.data() as UserChat)
        }
      })
    }

    return contacts
  }
}

export class ChatMessages extends ChatRequest {
  chatCol?: FireReq
  limit = 20

  constructor (payload: FireChatPayload) {
    super()
    const { userid, sellerid } = payload
    this.chatCol = chatsSellerCol(sellerid).doc(userid).collection('messages')
  }

  async getChat (): Promise<Chat[]> {
    const messages: Chat[] = []

    if (this.requestMessages) {
      const request = await this.requestMessages.get()
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

    if (this.requestMessages && this.lastVisible) {
      const request = await this.requestMessages
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
