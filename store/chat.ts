import { chatList, chatMessages, chatRead, sendChat, getContact, getContactSeller } from '../api/chat'
import { Chat, ChatOrder, ChatProduct, UserChat, UserChatBasic, UserChatSeller } from '../model/chat'
import { ISystemState } from '../store/system'
import { Commit, Namespaced, Store } from '../store/types'
import { IUserState } from '../store/user'
import { Module } from 'vuex'
import { getShop } from '../api/shop'
import { getUser } from '../api/user'
import { errorLog } from '../utils/logger'

const perpage = 20
const contactPerpage = 20

export interface IChatState {
  // chat action
  showMini: boolean
  showRecomend: boolean
  userActive: UserChatBasic

  // extra
  productids: string[]
  orderids: string[]
  unread: number

  // messages
  product: ChatProduct | null
  order: ChatOrder | null
  message: Chat[]
  unsend: Chat[]
  errorchat: Chat[]
  loading: boolean
  endpage: boolean

  // contact
  userlist: UserChat[]
  contactEndpage: boolean
  contactLoading: boolean
}

export const emptyUserActive: UserChatBasic = {
  id: '',
  unread: 0,
  last_chat: 0,
  last_msg: {
    id: '',
    from_id: '',
    to_id: '',
    created: 0
  },
  name: '',
  seller_name: '',
  state: 'offline',
  photoUrl: ''
}

export async function getUserChat (id: string): Promise<UserChat> {
  const user = await getUser(id)
  const userChat: UserChat = {
    ...emptyUserActive,
    id: user.id,
    name: user.name,
    photoUrl: user.photoUrl || ''
  }

  return userChat
}

async function getSellerChat (shopid: string): Promise<UserChatSeller> {
  const seller = await getShop(shopid)
  const userChat: UserChatSeller = {
    ...emptyUserActive,
    ...seller,
    is_seller: true
  }

  return userChat
}

const state: IChatState = {
  showMini: false,
  showRecomend: false,
  loading: false,
  userActive: emptyUserActive,
  message: [],
  unsend: [],
  errorchat: [],
  userlist: [],
  product: null,
  order: null,
  productids: [],
  orderids: [],
  unread: 0,
  endpage: false,
  contactEndpage: false,
  contactLoading: false
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
    state.userlist = [...state.userlist, ...data]
    state.contactLoading = false
    state.contactEndpage = data.length < contactPerpage
  },

  update_user_list (state: IChatState, data: Chat): void {
    state.userlist = state.userlist.map(user => {
      if (user.id === data.from_id) {
        user.last_chat = data.created
        user.last_msg = data
        user.unread += 1
      }
      return user
    })
  },

  push_user_list (state: IChatState, data: UserChat): void {
    state.userlist = [data, ...state.userlist]
  },

  set_message (state: IChatState, data: Chat[]): void {
    state.message = [...data, ...state.message]
    state.loading = false
    state.endpage = data.length < perpage
    state.unsend = []
    state.errorchat = []
    state.orderids = []
    state.productids = []
  },

  reset_message (state: IChatState): void {
    state.message = []
    state.endpage = false
  },

  push_message (state: IChatState, data: Chat): void {
    state.message.push(data)
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

  set_user_read (state: IChatState, id: string): void {
    state.userlist = state.userlist.map(user => {
      let unread = user.unread
      if (user.id === id) {
        unread = 0
      }
      return { ...user, unread }
    })
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
    state.message = []
    state.showMini = true
  },

  async openContact (store: Context): Promise<void> {
    const { commit, rootState, state } = store
    state.contactLoading = true
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

  async paginateContact (store: Context): Promise<void> {
    const { commit, state, rootState } = store
    const { isSeller } = rootState.system

    const userlist = await chatList(isSeller, {
      start_after: state.userlist[state.userlist.length - 1].id,
      limit: contactPerpage
    })

    commit('set_user_list', userlist)
  },

  async openChat (store: Context, user: UserChat|string): Promise<void> {
    const { commit, rootState } = store
    const uid = rootState.user.uid
    state.message = []
    state.loading = true
    commit('set_user', emptyUserActive)

    if (typeof user === 'string') {
      if (rootState.system.isSeller) {
        const userChat = await getUserChat(user)
        const contact = await getContactSeller(user, uid)
        commit('set_user', { ...userChat, ...contact })
      } else {
        const userChat = await getSellerChat(user)
        const contact = await getContact(uid, user)
        commit('set_user', { ...contact, ...userChat })
      }
    } else {
      commit('set_user', user)
    }
  },

  async getMessage (store: Context): Promise<void> {
    const { commit, state, rootState } = store
    const { isSeller } = rootState.system
    const userid = isSeller ? rootState.user.shopid : rootState.user.uid
    const targetid = state.userActive.id
    if (targetid === '') {
      return
    }

    store.state = {
      ...state,
      message: [],
      loading: true
    }

    let msg: Chat[] = []
    let unread = 0
    try {
      if (isSeller) {
        const chatInfo = await getContactSeller(targetid, userid)
        unread = chatInfo.unread
      } else {
        const chatInfo = await getContact(userid, targetid)
        unread = chatInfo.unread
      }
      await chatRead(state.userActive.id, isSeller)
      msg = await chatMessages(targetid, {
        seller: isSeller,
        limit: perpage
      })
    } catch (e) {
      errorLog(e)
    }

    const fixmsg: Chat[] = msg.reverse()
    commit('add_unread', -(unread))
    commit('set_user_read', targetid)
    commit('set_message', fixmsg)
  },

  async paginateChat (store: Context): Promise<void> {
    const { commit, state, rootState } = store
    const { isSeller } = rootState.system

    const msg = await chatMessages(state.userActive.id, {
      seller: isSeller,
      start_after: state.message[0].id,
      limit: perpage
    })

    commit('set_message', msg.reverse())
  },

  async pushChat (store: Context, chat: Chat): Promise<void> {
    const { commit, state, rootState } = store

    if (chat.from_id === state.userActive.id) {
      commit('push_message', chat)
    } else {
      const findUser = state.userlist.find(user => user.id === chat.from_id)
      if (findUser) {
        commit('update_user_list', chat)
      } else {
        if (rootState.system.isSeller) {
          const userChat = await getUserChat(chat.from_id)
          userChat.last_msg = chat
          userChat.last_chat = chat.created
          userChat.unread = 1
          commit('push_user_list', userChat)
        } else {
          const userChat = await getSellerChat(chat.from_id)
          userChat.last_msg = chat
          userChat.last_chat = chat.created
          userChat.unread = 1
          commit('push_user_list', userChat)
        }
      }
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

    commit('push_message_unsend', chat)
    try {
      const chatsuccess = await sendChat(state.userActive.id, isSeller, chat)
      commit('remove_message_unsend', chat)
      commit('push_message', chatsuccess)
      commit('update_user_list', chatsuccess)
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
    commit('set_message', [])
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
