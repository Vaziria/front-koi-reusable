import { Module } from 'vuex'
import { StateType } from '../store/types'

export interface ILoadingState extends StateType {
  show: boolean
  text: string
}

const state: ILoadingState = {
  show: false,
  text: ''
}

const mutations = {
  set_loading: function (state: ILoadingState, data: boolean): void {
    state.show = data
  },
  set_text: function (state: ILoadingState, data: string): void {
    state.text = data
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
