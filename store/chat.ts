import { chatList, sendChat, getContact, getContactSeller } from '../api/chat'
import { Chat, ChatOrder, ChatProduct, UserChat, UserChatBasic } from '../model/chat'
import { ISystemState } from '../store/system'
import { Commit, Namespaced, Store } from '../store/types'
import { IUserState } from '../store/user'
import { Module } from 'vuex'
import { emptyUserActive, getSellerChat, getUserChat } from '../api/chatUser'

const contactPerpage = 20

export interface IChatState {
  // chat action
  showMini: boolean
  showRecomend: boolean
  userActive: UserChatBasic

  // messages
  product: ChatProduct | null
  order: ChatOrder | null
  unsend: Chat[]
  errorchat: Chat[]

  // contact
  userlist: UserChat[]

  // extra
  unread: number
}

const state: IChatState = {
  showMini: false,
  showRecomend: false,
  userActive: emptyUserActive,
  unsend: [],
  errorchat: [],
  userlist: [],
  product: null,
  order: null,
  unread: 0
}

const mutations = {
  mini_show (state: IChatState, data: boolean): void {
    state.showMini = data
  },

  toogleShowRecomend (state: IChatState, payload: boolean): void {
    state.showRecomend = payload
  },

  set_order (state: IChatState, data: null | ChatOrder): void {
    state.product = null
    state.order = data
  },

  set_product (state: IChatState, data: null | ChatProduct): void {
    state.order = null
    state.product = data
    state.showRecomend = false
  },

  reset_user (state: IChatState): void {
    state.userActive = emptyUserActive
  },

  set_user (state: IChatState, user: UserChat): void {
    state.userActive = user
    const ada = state.userlist.filter(userchat => {
      if (user.id === userchat.id) return true
      return false
    })

    if (ada.length === 0 && user.id) {
      state.userlist.unshift(user)
    }
  },

  set_user_list (state: IChatState, data: UserChat[]): void {
    state.userlist = data
  },

  update_user_list (state: IChatState, contact: UserChat): void {
    state.userlist = state.userlist.map(user => {
      if (user.id === contact.id) {
        return {
          ...user,
          ...contact
        }
      }
      return user
    })
  },

  push_user_list (state: IChatState, data: UserChat): void {
    state.userlist = [data, ...state.userlist]
  },

  push_message_error (state: IChatState, data: Chat): void {
    state.errorchat.push(data)
  },

  push_message_unsend (state: IChatState, data: Chat): void {
    state.unsend.push(data)
  },

  remove_message_unsend (state: IChatState, data: Chat): void {
    state.unsend = state.unsend.filter(chat => {
      if (chat.id === data.id) {
        return false
      }
      return true
    })
  },

  remove_message_error (state: IChatState, data: Chat): void {
    state.errorchat = state.errorchat.filter(chat => {
      if (chat.id === data.id) {
        return false
      }
      return true
    })
  },

  reset_message_unsend_error (state: IChatState): void {
    state.errorchat = []
    state.unsend = []
  },

  clear_order_product (state: IChatState): void {
    state.order = null
    state.product = null
  },

  set_unread (state: IChatState, unread: number): void {
    state.unread = unread
  },

  add_unread (state: IChatState, num: number): void {
    state.unread += num
  },

  reset_unread (state: IChatState): void {
    state.unread = 0
  }
}

export type ChatMutation = typeof mutations
type RootState = {
  user: IUserState
  system: ISystemState
}
type Context = Commit<ChatMutation> & { state: IChatState } & { rootState: RootState }

const actions = {
  async open (store: Context): Promise<void> {
    const { state } = store
    state.showMini = true
  },

  async openContact (store: Context): Promise<void> {
    const { commit, rootState, state } = store
    const userlist = await chatList(rootState.system.isSeller, {
      limit: contactPerpage
    })

    const userActive = userlist.find(user => user.id === state.userActive.id)
    if (state.userActive.id && !userActive) {
      state.userlist = [state.userActive]
    } else {
      state.userlist = []
    }
    commit('set_user_list', userlist)
  },

  async openChat (store: Context, user: UserChat|string): Promise<void> {
    const { commit, rootState } = store
    const uid = rootState.user.uid
    commit('set_user', emptyUserActive)

    if (typeof user === 'string') {
      if (rootState.system.isSeller) {
        const userChat = await getUserChat(user)
        const contact = await getContactSeller(user, uid)
        commit('set_user', { ...userChat, ...contact })
      } else {
        const userChat = await getSellerChat(user)
        const contact = await getContact(uid, user)
        commit('set_user', { ...userChat, ...contact })
      }
    } else {
      commit('set_user', user)
    }
  },

  async sendChat (store: Context, chat: Chat): Promise<void> {
    const { commit, state, rootState } = store
    const { order, product } = state
    const isSeller = rootState.system.isSeller

    if (order) {
      chat.orderid = order.id
    }

    if (isSeller) {
      chat.shopid = rootState.user.shopid
      chat.from_id = rootState.user.shopid
    } else {
      chat.shopid = state.userActive.id
    }

    if (product) {
      chat.productid = product.id
    }

    // check jika yang kirim cs
    if (rootState.user.role.includes('cs')) {
      chat.cs_id = rootState.user.uid
    }

    commit('remove_message_error', chat)
    commit('push_message_unsend', chat)
    try {
      await sendChat(state.userActive.id, isSeller, chat)
      commit('remove_message_unsend', chat)
    } catch {
      commit('push_message_error', chat)
    }

    commit('clear_order_product')
  },

  async getUnread (state: Context, getUnread: () => Promise<number>): Promise<void> {
    const unread = await getUnread()
    state.commit('set_unread', unread)
  },

  close (store: Context): void {
    const { commit } = store
    commit('set_user', emptyUserActive)
    commit('mini_show', false)
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
const chat: Module<IChatState, RootState> = {
  namespaced: true,
  mutations,
  actions,
  state
}

export default chat

export type ChatAction = typeof actions
export type ChatStore = Store<{ 'chat': IChatState }, Namespaced<ChatMutation, 'chat'>, Namespaced<ChatAction, 'chat'>>
