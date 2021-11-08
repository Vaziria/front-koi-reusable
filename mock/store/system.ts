import { Module } from 'vuex'
import systemStore, { ISystemState, SystemMutation, SystemAction } from '../../store/system'

export {
  ISystemState,
  SystemMutation,
  SystemAction
}

export const state:ISystemState = {
  ...systemStore.state,
  isSeller: true,
  isMobile: false
}

// eslint-disable-next-line @typescript-eslint/ban-types
const system: Module<ISystemState, {}> = {
  namespaced: true,
  mutations: systemStore.mutations,
  actions: systemStore.actions,
  state
}

export default system
