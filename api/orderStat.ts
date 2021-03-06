import firebase from 'firebase'
import { PaidStatus, StatusOrder, ThreatTipe } from '../model/order'

type DocData = firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
type ColQuery = firebase.firestore.Query<firebase.firestore.DocumentData>

export type Payload = {
  sellerid: string
  csid?: string
  buyerid?: string
}
export type StatusPayload = {
  status: StatusOrder
  payStatus?: PaidStatus
  threat?: ThreatTipe
}

const fire = firebase.firestore()
function orderCol (sellerid: string): DocData | ColQuery {
  if (sellerid) {
    return fire.collection('Sellers')
      .doc(sellerid)
      .collection('orders')
  }

  return fire.collectionGroup('orders')
}

export async function orderStatusCount (payload: Payload, payloadStatus: StatusPayload): Promise<number> {
  const { sellerid, buyerid, csid } = payload
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

  if (csid) {
    orders = orders.where('cs.id', '==', csid)
  }

  const data = await orders.get()
  return data.size
}
