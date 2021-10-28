import { readAll } from '../api/notification'
import { Commit, Namespaced, Store } from '../store/types'
import { Module } from 'vuex'
import { INotif } from '../model/notifs'
import { transaksiUnread, diskusiUnread, buyerTransaksiTypes, sellerTransaksiTypes } from '../api/fireNotif'
import { IUserState } from './user'
import { ISystemState } from './system'

export interface INotifState {
  transaksiCount: number
  diskusiCount: number
  newNotif: INotif[]
}
const state: INotifState = {
  transaksiCount: 0,
  diskusiCount: 0,
  newNotif: []
}

const mutations = {
  reset_notif (state: INotifState): void {
    state.transaksiCount = 0
    state.diskusiCount = 0
    state.newNotif = []
  },

  set_transaksi_unread (state: INotifState, unread: number): void {
    state.transaksiCount = unread
  },

  set_diskusi_unread (state: INotifState, unread: number): void {
    state.diskusiCount = unread
  },

  push_new_notif (state: INotifState, notif: INotif): void {
    state.newNotif = [...state.newNotif, notif]

    if (notif.type === 'diskusi') {
      state.diskusiCount += 1
    }

    const transaksiTypes = [
      ...sellerTransaksiTypes,
      ...buyerTransaksiTypes
    ]
    if (transaksiTypes.includes(notif.type)) {
      state.transaksiCount += 1
    }
  }
}

export type NotifMutation = typeof mutations
type RootState = {
  user: IUserState
  system: ISystemState
}
type Context = Commit<NotifMutation> & { state: INotifState } & { rootState: RootState }

const actions = {
  async getTransaksiUnread (state: Context): Promise<void> {
    const { user, system } = state.rootState
    const unread = await transaksiUnread(user.uid, system.isSeller)
    state.commit('set_transaksi_unread', unread)
  },

  async getDiskusiUnread (state: Context): Promise<void> {
    const { user } = state.rootState
    const unread = await diskusiUnread(user.uid)
    state.commit('set_diskusi_unread', unread)
  },

  async readAll (state: Context): Promise<void> {
    await readAll()
    state.commit('reset_notif')
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
const Notif: Module<INotifState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default Notif

export type NotifAction = typeof actions
export type NotifStore = Store<{ 'notif': INotifState }, Namespaced<NotifMutation, 'notif'>, Namespaced<NotifAction, 'notif'>>
