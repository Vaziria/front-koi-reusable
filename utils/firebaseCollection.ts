import firebase from 'firebase'

export type FireReq = firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
export type DocData = firebase.firestore.DocumentData
export type StoreQuery<T> = firebase.firestore.Query<T>
export type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>
export type QueryCallback<T> = (type: firebase.firestore.DocumentChangeType, data: T) => void
export type FireError = firebase.firestore.FirestoreError

const fire = firebase.firestore()

// user & sellers
// ***
export function UserCol (): FireReq {
  return fire.collection('Users')
}

export function SellerCol (): FireReq {
  return fire.collection('Sellers')
}
// ***

// chats
// ***
export function chatsBuyerCol (user: string): FireReq {
  return fire
    .collection('Users')
    .doc(user)
    .collection('chats')
}

export function chatsSellerCol (sellerid: string): FireReq {
  return fire
    .collection('Sellers')
    .doc(sellerid)
    .collection('seller_chats')
}
// ***

// notifs
// ***
export function userNotifsCol (userid: string): FireReq {
  return UserCol()
    .doc(userid)
    .collection('notifications')
}

export function publicNotifsCol (): FireReq {
  return fire.collection('NotifHist')
}
// ***

// diskusis
// ***
export function sellerDiskusisCol (shopid: string): StoreQuery<DocData> {
  return fire
    .collectionGroup('diskusi')
    .where('shopid', '==', shopid)
}

export function sellerRepliessCol (shopid: string): StoreQuery<DocData> {
  return fire
    .collectionGroup('replies')
    .where('shopid', '==', shopid)
}

export function buyerDiskusisCol (userid: string): StoreQuery<DocData> {
  return fire
    .collectionGroup('diskusi')
    .where('userid', '==', userid)
}
// ***
