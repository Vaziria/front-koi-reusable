import firebase from 'firebase'
import { Chat } from '../model/chat'
import { UserStore } from '../store/user'
import { SystemStore } from '../store/system'

export function subChatSeller (store: UserStore, db: firebase.firestore.Firestore, callback: (chat: Chat) => void): () => void {
  const uid = store.state.user.uid
  const role = store.state.user.role

  let subchat

  if (role.includes('cs')) {
    subchat = db.collectionGroup('messages').where('cs_id', '==', uid)
  } else {
    subchat = db.collectionGroup('messages').where('to_id', '==', uid)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subchat = subchat.where('created', '>=', Date.now()).onSnapshot((snap) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap.docChanges().forEach(async (change) => {
      if (change.type === 'added') {
        const chat: Chat = change.doc.data() as Chat
        await callback(chat)
      } else {
        console.log('subchat not type added')
      }
    })
  })

  return subchat
}

export function subChat (store: SystemStore & UserStore, db: firebase.firestore.Firestore, callback: (chat: Chat) => void): () => void {
  const isSeller = store.state.system.isSeller
  const uid = store.state.user.uid

  let subchat

  if (isSeller) {
    return subChatSeller(store, db, callback)
  } else {
    subchat = db.collectionGroup('messages').where('to_id', '==', uid)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subchat = subchat.where('created', '>=', Date.now()).onSnapshot((snap) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap.docChanges().forEach(async (change) => {
      if (change.type === 'added') {
        const chat: Chat = change.doc.data() as Chat
        await callback(chat)
      } else {
        console.log('subchat not type added')
      }
    })
  })

  return subchat
}
