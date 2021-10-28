import firebase from 'firebase'

export type FireReq = firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
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
