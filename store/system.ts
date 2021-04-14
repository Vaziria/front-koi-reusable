import { Module } from 'vuex'
import { StateType } from './types'

export interface ISystemState extends StateType {
    isMobile: boolean
}

function isMobile (): boolean {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true
  }
  return false
}

const state: ISystemState = {
  isMobile: isMobile()
}

const mutations = {
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
