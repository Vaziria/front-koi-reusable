import Vue from 'vue'
import { Commit, Dispatch } from '../../store/types'
import Vuex, { Store as VuexStore } from 'vuex'
import user, { IUserState, UserMutation, UserAction } from './user'
import system, { ISystemState, SystemMutation, SystemAction } from './system'
import chat, { IChatState, ChatMutation, ChatAction } from './chat'

Vue.use(Vuex)

export type State = {
  user: IUserState
  system: ISystemState
  chat: IChatState
}

type Namespaced<T, N extends keyof State> = {
  [P in keyof T & string as `${N}/${P}`]: T[P]
}

type Getter = {
  getters: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [ K in keyof {} ]: ReturnType<{}[K]>
  }
}

type Actions = Namespaced<ChatAction, 'chat'>
& Namespaced<SystemAction, 'system'>
& Namespaced<UserAction, 'user'>

type Mutations = Namespaced<UserMutation, 'user'>
& Namespaced<SystemMutation, 'system'>
& Namespaced<ChatMutation, 'chat'>

export type MockStore = Omit<VuexStore<State>, 'getters' | 'commit' | 'dispatch'> & Commit<Mutations> & Dispatch<Actions> & Getter

const store: MockStore = new Vuex.Store({
  modules: {
    user,
    system,
    chat
  }
}) as MockStore

export default store
