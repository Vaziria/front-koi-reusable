import Vue from 'vue'
import { Commit, Dispatch } from '../../store/types'
import Vuex, { Store as VuexStore } from 'vuex'
import { ISystemState } from '../../store/system'
import { IUserState } from '../../store/user'
import { IChatState } from '../../store/chat'
import user, { UserMutation } from './user'
import system, { SystemMutation } from './system'
import chat, { ChatMutation } from './chat'

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

type Mutations = Namespaced<UserMutation, 'user'>
& Namespaced<SystemMutation, 'system'>
& Namespaced<ChatMutation, 'chat'>
// eslint-disable-next-line @typescript-eslint/ban-types
export type MockStore = Omit<VuexStore<State>, 'getters' | 'commit' | 'dispatch'> & Commit<Mutations> & Dispatch<{}> & Getter

const store: MockStore = new Vuex.Store({
  modules: {
    user,
    system,
    chat
  }
}) as MockStore

export default store
