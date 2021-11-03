import { Module } from 'vuex'
import { IChatState } from '../../store/chat'
import { single as singleContact, multiple as multipleContact } from '../chat/contact'
import { getRandomNum } from '../mock'

export const state:IChatState = {
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

export const mutations = {
}
export type ChatMutation = typeof mutations

// eslint-disable-next-line @typescript-eslint/ban-types
const chat: Module<IChatState, {}> = {
  namespaced: true,
  mutations,
  state
}

export default chat
