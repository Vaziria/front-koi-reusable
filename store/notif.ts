import { readAll } from '../api/notification'
import { Commit, Namespaced, Store } from '../store/types'
import { Module } from 'vuex'
import { INotif } from '../model/notifs'

export interface INotifState {
  unreadCount: number
  chatNotifCount: number
  newNotif: INotif[]
}
const state: INotifState = {
  unreadCount: 0,
  chatNotifCount: 0,
  newNotif: []
}

const mutations = {
  reset_notif (state: INotifState): void {
    state.unreadCount = 0
    state.chatNotifCount = 0
    state.newNotif = []
  },

  reset_chat_notif (state: INotifState): void {
    state.chatNotifCount = 0
  },

  set_unread (state: INotifState, data: number): void {
    state.unreadCount = data
  },

  set_chat_unread (state: INotifState, data: number): void {
    state.chatNotifCount = data
  },

  add_notif_unread (state: INotifState, add: number): void {
    state.unreadCount += add
  },

  add_chat_unread (state: INotifState, add: number): void {
    state.chatNotifCount += add
  },

  push_new_notif (state: INotifState, notif: INotif): void {
    state.newNotif = [...state.newNotif, notif]
    if (notif.type !== 'new_chat') {
      state.unreadCount += 1
    } else {
      state.chatNotifCount += 1
    }
  }
}

export type NotifMutation = typeof mutations
type Context = Commit<NotifMutation> & { state: INotifState }

const actions = {
  async getUnread (state: Context, getUnread: () => Promise<number>): Promise<void> {
    const unread = await getUnread()
    state.commit('set_unread', unread)
  },

  async geChattUnread (state: Context, getUnread: () => Promise<number>): Promise<void> {
    const unread = await getUnread()
    state.commit('set_chat_unread', unread)
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
export type NotifStore = Store<{ 'notif': INotifState }, Namespaced<NotifMutation, 'notif'>, Namespaced<NotifAction, 'notif'>>
