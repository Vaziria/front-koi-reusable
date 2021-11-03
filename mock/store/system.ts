import { Module } from 'vuex'
import { ISystemState } from '../../store/system'

export const state:ISystemState = {
  isSeller: true,
  isMobile: false
}

export const mutations = {
  setIsSeller (state: ISystemState, isSeller: boolean): void {
    state.isSeller = isSeller
  },

  setisMobile (state: ISystemState, isMobile: boolean): void {
    state.isMobile = isMobile
  }
}
export type SystemMutation = typeof mutations

// eslint-disable-next-line @typescript-eslint/ban-types
const system: Module<ISystemState, {}> = {
  namespaced: true,
  mutations,
  state
}

export default system
