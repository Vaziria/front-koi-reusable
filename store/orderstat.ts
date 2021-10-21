import { Commit, Namespaced, Store } from '../store/types'
import { Module } from 'vuex'
import { orderStatusCount, Payload } from '../api/orderStat'
import { IUserState } from './user'
import { ISystemState } from './system'
import { PaidStatus, ThreatTipe } from '../model/order'

type PayStatusCount = {
  [key in PaidStatus]: number
}

type ThreatCount = {
  [key in ThreatTipe]: number
}

export interface IOrderstatState {
  orderWaitCount: number
  orderUnpaidCount: number
  orderUnverifCount: number
  orderReadyToSendCount: number
  orderKarantinaCount: number
  orderTitipCount: number
}
const state: IOrderstatState = {
  orderWaitCount: 0,
  orderUnpaidCount: 0,
  orderUnverifCount: 0,
  orderReadyToSendCount: 0,
  orderKarantinaCount: 0,
  orderTitipCount: 0
}

const mutations = {
  set_wait_count (state: IOrderstatState, count: number): void {
    state.orderWaitCount = count
  },

  add_wait_count (state: IOrderstatState, add: number): void {
    state.orderWaitCount += add
  },

  set_pending_count (state: IOrderstatState, count: PayStatusCount): void {
    state.orderUnpaidCount = count.unpaid
    state.orderUnverifCount = count.unverify
  },

  add_unpaid_count (state: IOrderstatState, add: number): void {
    state.orderUnpaidCount += add
  },

  add_unverif_count (state: IOrderstatState, add: number): void {
    state.orderUnverifCount += add
  },

  set_process_count (state: IOrderstatState, count: ThreatCount): void {
    state.orderReadyToSendCount = count.ready
    state.orderKarantinaCount = count.karantina
    state.orderTitipCount = count.titip
  },

  add_ready_send_count (state: IOrderstatState, add: number): void {
    state.orderReadyToSendCount += add
  },

  add_karantina_count (state: IOrderstatState, add: number): void {
    state.orderKarantinaCount += add
  },

  add_titip_count (state: IOrderstatState, add: number): void {
    state.orderTitipCount += add
  },

  reset_count (state: IOrderstatState): void {
    state.orderWaitCount = 0
    state.orderUnpaidCount = 0
    state.orderUnverifCount = 0
    state.orderReadyToSendCount = 0
    state.orderKarantinaCount = 0
    state.orderTitipCount = 0
  }
}

export type OrderstatMutation = typeof mutations
type RootState = {
  user: IUserState
  system: ISystemState
}
type Context = Commit<OrderstatMutation> & { state: IOrderstatState } & { rootState: RootState }

function getCountPayload (sellerid: string, rootState: RootState): Payload {
  const payload: Payload = { sellerid }

  if (!rootState.system.isSeller) {
    payload.buyerid = rootState.user.uid
  } else if (rootState.user.uid !== sellerid) {
    payload.csid = rootState.user.uid
  }

  return payload
}

const actions = {
  async getOrderWait (store: Context, sellerid: string): Promise<void> {
    const { commit, rootState } = store
    const payload = getCountPayload(sellerid, rootState)
    const count = await orderStatusCount(payload, { status: 'waitverif' })

    commit('set_wait_count', count)
  },

  async getOrderPending (store: Context, sellerid: string): Promise<void> {
    const { commit, rootState } = store
    const payload = getCountPayload(sellerid, rootState)
    const payStatuses: PaidStatus[] = ['unpaid', 'unverify']
    const result: PayStatusCount = {
      unpaid: 0,
      unverify: 0,
      paid: 0
    }

    await Promise.all(payStatuses.map(async (payStatus) => {
      const count = await orderStatusCount(payload, {
        status: 'pending',
        payStatus
      })

      result[payStatus] = count
    }))

    commit('set_pending_count', result)
  },

  async getOrderProcess (store: Context, sellerid: string): Promise<void> {
    const { commit, rootState } = store
    const payload = getCountPayload(sellerid, rootState)
    const threatTipes: ThreatTipe[] = ['ready', 'karantina', 'titip']
    const result: ThreatCount = {
      ready: 0,
      karantina: 0,
      titip: 0
    }

    await Promise.all(threatTipes.map(async (threat) => {
      const count = await orderStatusCount(payload, {
        status: 'process',
        threat
      })

      result[threat] = count
    }))

    commit('set_process_count', result)
  }
}

const OrderStat: Module<IOrderstatState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default OrderStat

export type OrderstatAction = typeof actions
export type OrderstatStore = Store<{ 'orderstat': IOrderstatState }, Namespaced<OrderstatMutation, 'orderstat'>, Namespaced<OrderstatAction, 'orderstat'>>
