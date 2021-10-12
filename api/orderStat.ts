import firebase from 'firebase'
import { PaidStatus, StatusOrder, ThreatTipe } from '../model/order'

type DocData = firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
export type Payload = {
  sellerid: string
  buyerid?: string
}
export type StatusPayload = {
  status: StatusOrder
  payStatus?: PaidStatus
  threat?: ThreatTipe
}

const fire = firebase.firestore()
function orderCol (sellerid: string): DocData {
  return fire.collection('Sellers')
    .doc(sellerid)
    .collection('orders')
}

export async function orderStatusCount (payload: Payload, payloadStatus: StatusPayload): Promise<number> {
  const { sellerid, buyerid } = payload
  const { status, payStatus, threat } = payloadStatus
  let orders = orderCol(sellerid)
    .where('status', '==', status)

  if (payStatus) {
    orders = orders.where('pay_status', '==', payStatus)
  }

  if (threat) {
    orders = orders.where('threat_tipe', '==', threat)
  }

  if (buyerid) {
    orders = orders.where('buyer.id', '==', buyerid)
  }

  const data = await orders.get()
  return data.size
}
