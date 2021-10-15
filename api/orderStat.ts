import firebase from 'firebase'
import { PaidStatus, StatusOrder, ThreatTipe } from '../model/order'

type DocData = firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
| firebase.firestore.Query<firebase.firestore.DocumentData>

export type Payload = {
  sellerid?: string
  buyerid?: string
}
export type StatusPayload = {
  status: StatusOrder
  payStatus?: PaidStatus
  threat?: ThreatTipe
}

const fire = firebase.firestore()
function orderCol (payload: Payload): DocData {
  const { sellerid, buyerid } = payload

  if (sellerid) {
    return fire.collection('Sellers')
      .doc(sellerid)
      .collection('orders')
  }

  return fire.collectionGroup('orders').where('buyer.id', '==', buyerid)
}

export async function orderStatusCount (payload: Payload, payloadStatus: StatusPayload): Promise<number> {
  const { status, payStatus, threat } = payloadStatus
  let orders = orderCol(payload)
    .where('status', '==', status)

  if (payStatus) {
    orders = orders.where('pay_status', '==', payStatus)
  }

  if (threat) {
    orders = orders.where('threat_tipe', '==', threat)
  }

  const data = await orders.get()
  return data.size
}
