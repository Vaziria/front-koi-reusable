import { Module } from 'vuex'
import chatStore, { IChatState, ChatMutation, ChatAction, RootState } from '../../store/chat'
import { single as singleContact, multiple as multipleContact } from '../chat/contact'
import { getRandomNum } from '../mock'

export {
  IChatState,
  ChatMutation,
  ChatAction
}

export const state: IChatState = {
  ...chatStore.state,

  // chat action
  showMini: false,
  showRecomend: false,
  userActive: singleContact(),

  // messages
  product: null,
  order: null,
  unsend: [],
  errorchat: [],

  // contact
  userlist: multipleContact(),

  // extra
  unread: getRandomNum(10)
}

const chat: Module<IChatState, RootState> = {
  namespaced: true,
  mutations: chatStore.mutations,
  actions: chatStore.actions,
  state
}

export default chat
