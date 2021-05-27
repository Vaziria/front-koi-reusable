import { readAll } from '@/reusable/api/notification'
import { Notif } from '@/reusable/model/notif'
import { Commit, Namespaced, Store } from '@/reusable/store/types'
import { Module } from 'vuex'

export interface INotifState {
  unread: Notif[]
  unreadCount: number
  newNotif: Notif[]
}
const state: INotifState = {
  unread: [],
  unreadCount: 0,
  newNotif: []
}

const mutations = {
  reset_notif (state: INotifState): void {
    state.unread = []
    state.unreadCount = 0
    state.newNotif = []
  },
  set_unread (state: INotifState, data: Notif[]): void {
    state.unread = data
    state.unreadCount = data.length
  },
  push_new_notif (state: INotifState, notif: Notif): void {
    state.newNotif = [...state.newNotif, notif]
    if (notif.type !== 'new_chat') {
      state.unreadCount += 1
    }
  }
}

export type NotifMutation = typeof mutations
type Context = Commit<NotifMutation> & { state: INotifState }

const actions = {
  async getUnread (state: Context): Promise<void> {
    const notif:Notif[] = []
    state.commit('set_unread', notif)
  },
  async readAll (state: Context): Promise<void> {
    await readAll()
    state.commit('reset_notif')
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
const Notif: Module<INotifState, {}> = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default Notif

export type NotifAction = typeof actions
export type NotifStore = Store<{ 'notif': INotifState }, Namespaced<NotifMutation, 'Notif'>, Namespaced<NotifAction, 'Notif'>>
