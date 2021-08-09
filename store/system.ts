import { Module } from 'vuex'
import { Namespaced, StateType, Store } from './types'

export interface ISystemState extends StateType {
    isMobile: boolean
    isSeller: boolean
}

export function isMobile (userAgent?: string): boolean {
  userAgent = userAgent || navigator.userAgent
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return true
  }
  return false
}

const state: ISystemState = {
  isMobile: isMobile(),
  isSeller: false
}

const mutations = {
  set_system (state: ISystemState, data: Partial<ISystemState>): void {
    Object.assign(state, data)
  }
}

export type SystemMutation = typeof mutations
// type Context = Commit<SystemMutation> & { state: ISystemState }

const actions = {}

// eslint-disable-next-line @typescript-eslint/ban-types
const system: Module<ISystemState, {}> = {
  namespaced: true,
  mutations,
  actions,
  state
}

export default system
export type SystemAction = typeof actions
export type SystemStore = Store<{ 'system': ISystemState }, Namespaced<SystemMutation, 'system'>, Namespaced<SystemAction, 'system'>>
