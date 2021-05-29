import { Module } from 'vuex'
import { StateType } from '../store/types'

export interface ILoadingState extends StateType {
  show: boolean
}

const state: ILoadingState = {
  show: false
}

const mutations = {
  set_loading: function (state: ILoadingState, data: boolean): void {
    state.show = data
  }
}

export type LoadingMutation = typeof mutations
// type Context = Commit<SystemMutation> & { state: ISystemState }

const actions = {}

// eslint-disable-next-line @typescript-eslint/ban-types
const loading: Module<ILoadingState, {}> = {
  namespaced: true,
  mutations,
  actions,
  state
}

export default loading
export type LoadingAction = typeof actions
