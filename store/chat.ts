import { chatList, chatMessages, chatRead, sendChat } from '@/reusable/api/chat'
import { Chat, ChatOrder, ChatProduct, UserChat, UserChatBasic, UserChatSeller } from '@/reusable/model/chat'
import { ISystemState } from '@/reusable/store/system'
import { Commit, Namespaced, Store } from '@/reusable/store/types'
import { IUserState } from '@/reusable/store/user'
import { StateChanger } from 'vue-infinite-loading'
import { Module } from 'vuex'
import { getShop } from '../api/shop'

const perpage = 20
const contactPerpage = 20
const defaultRef = {
  complete: function (): void { 'test' },
  reset: function (): void { 'test' },
  loaded: function (): void { 'test' },
  error: function (): void { 'test' }
}

export interface IChatState {
  showMini: boolean
  loading: boolean
  userActive: UserChatBasic
  userid: string
  product: ChatProduct | null
  order: ChatOrder | null
  message: Chat[],
  unsend: Chat[],
  errorchat: Chat[],
  userlist: UserChat[],
  productids: string[],
  orderids: string[]
  unread: number
  contactRef: StateChanger
  chatRef: StateChanger
  endpage: boolean
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

const state: IChatState = {
  showMini: false,
  loading: false,
  userActive: emptyUserActive,
  userid: '',
  message: [],
  unsend: [],
  errorchat: [],
  userlist: [],
  product: null,
  order: null,
  productids: [],
  orderids: [],
  unread: 0,
  contactRef: defaultRef,
  chatRef: defaultRef,
  endpage: false
}

const mutations = {
  mini_show (state: IChatState, data: boolean): void {
    state.showMini = data
  },

  loading (state: IChatState, data: boolean): void {
    state.loading = data
  },

  set_order (state: IChatState, data: null | ChatOrder): void {
    state.order = data
  },
  set_product (state: IChatState, data: null | ChatProduct): void {
    state.product = data
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
  push_user_list (state: IChatState, data: UserChat[]): void {
    state.userlist = [...state.userlist, ...data]
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
  set_user_unread (state: IChatState, id: string): void {
    state.userlist = state.userlist.map(user => {
      let unread = user.unread
      if (user.id === id) {
        unread += 1
      }
      return { ...user, unread }
    })
  },
  clear_order_product (state: IChatState): void {
    state.order = null
    state.product = null
  },
  set_message (state: IChatState, msg: Chat[]): void {
    state.loading = false
    state.message = msg
    state.unsend = []
    state.errorchat = []
    state.orderids = []
    state.productids = []
  },
  unshift_message (state: IChatState, data: Chat[]): void {
    state.message = [...data, ...state.message]
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
  reset_msg (state: IChatState): void {
    state.message = []
  },
  add_unread (state: IChatState, num: number): void {
    state.unread += num
  },
  reset_unread (state: IChatState): void {
    state.unread = 0
  },
  set_contact_ref (state: IChatState, data: StateChanger): void {
    state.contactRef = data
  },
  set_chat_ref (state: IChatState, data: StateChanger): void {
    state.chatRef = data
  },
  ref_contact_action (state: IChatState, length: number): void {
    if (length === 0 || length < contactPerpage) {
      state.endpage = true
      state.contactRef.complete()
    } else {
      state.endpage = false
      setTimeout(() => {
        state.contactRef.loaded()
      }, 3000)
    }
  },
  ref_action (state: IChatState, length: number): void {
    if (length === 0 || length < perpage) {
      state.endpage = true
      state.chatRef.complete()
    } else {
      state.endpage = false
      setTimeout(() => {
        state.chatRef.loaded()
      }, 3000)
    }
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
    const { commit, rootState } = store
    commit('mini_show', true)
    commit('set_user_list', [])
    const userlist = await chatList(rootState.system.isSeller, {
      limit: contactPerpage
    })
    commit('set_user_list', userlist)
    commit('ref_contact_action', userlist.length)
  },

  async openChat (store: Context, user: UserChat): Promise<void> {
    const { commit } = store
    commit('set_user', user)
  },

  async openChatSeller (store: Context, uid: string): Promise<void> {
    const { commit } = store

    const seller = await getShop(uid)

    const userChat: UserChatSeller = {
      ...seller,
      is_seller: true,
      unread: 0,
      last_chat: Date.now(),
      last_msg: {
        id: '',
        from_id: '',
        to_id: '',
        created: Date.now()
      },
      id: seller.id,
      name: '',
      seller_name: seller.seller_name,
      state: seller.state,
      photoUrl: seller.profile_image || seller.photoUrl
    }

    commit('set_user', userChat)
  },

  async getMessage (store: Context): Promise<void> {
    const { commit, state, rootState } = store
    const { isSeller } = rootState.system
    const uid = state.userActive.id
    if (uid === '') {
      return
    }

    commit('set_message', [])
    commit('loading', true)
    store.state.chatRef.reset()
    let msg: Chat[] = []
    try {
      await chatRead(state.userActive.id, isSeller)
      msg = await chatMessages(uid, {
        seller: isSeller,
        limit: perpage
      })
    } catch (e) {
      console.error(e)
    }

    const fixmsg: Chat[] = msg.reverse()
    commit('set_user_read', uid)
    commit('set_message', fixmsg)
    commit('ref_action', fixmsg.length)
  },

  async pushChat (store: Context, chat: Chat): Promise<void> {
    const { commit, state, rootState } = store
    const { isSeller } = rootState.system

    if (chat.from_id === state.userActive.id) {
      commit('push_message', chat)
    } else {
      commit('set_user_unread', chat.from_id)
    }

    const userids = state.userlist.map(user => user.id)
    if (userids.includes(chat.from_id)) {
      const userlist = await chatList(isSeller, {
        limit: contactPerpage
      })
      commit('set_user_list', userlist)
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
    } catch {
      commit('push_message_error', chat)
    }

    commit('clear_order_product')
  },

  async paginateContact (store: Context): Promise<void> {
    const { commit, state, rootState } = store
    const { isSeller } = rootState.system

    const userlist = await chatList(isSeller, {
      start_after: state.userlist[state.userlist.length - 1].id,
      limit: contactPerpage
    })
    commit('push_user_list', userlist)
    commit('ref_contact_action', userlist.length)
  },

  async paginate (store: Context): Promise<void> {
    const { commit, state, rootState } = store
    const { isSeller } = rootState.system

    const msg = await chatMessages(state.userActive.id, {
      seller: isSeller,
      start_after: state.message[0].id,
      limit: perpage
    })

    commit('unshift_message', msg.reverse())
    commit('ref_action', msg.length)
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
