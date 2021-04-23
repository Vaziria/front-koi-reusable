/* eslint-disable @typescript-eslint/ban-types */
import { auth } from '@/utils/firebase'
import firebase from 'firebase'
import { Module } from 'vuex'
import { getAccess } from '../auth/user'
import { Access } from '../model/access'
import { Commit, Namespaced, StateType, Store } from './types'

export interface IUserState extends StateType {
    uid: string
    token: string
    expiryToken: number
    isLogin: boolean
    role: string[],
    displayName: string
    email: string
    phoneNumber: string
    photoUrl: string
    shopid: string
}

const state: IUserState = {
  uid: '',
  token: localStorage.getItem('token') || '',
  expiryToken: parseFloat(localStorage.getItem('expiryToken') || ''),
  isLogin: !!localStorage.getItem('token'),
  role: [],
  displayName: '',
  email: '',
  phoneNumber: '',
  photoUrl: '',
  shopid: ''

}

const mutations = {
  set_login (state: IUserState, isLogin: boolean): void {
    state.isLogin = isLogin
  },
  set_access (state: IUserState, access: Access): void {
    state.role = access.role || []
    state.shopid = access.shopid
  },
  set_user_data (state: IUserState, user: firebase.User): void {
    state.uid = user.uid || ''
    state.displayName = user.displayName || 'username'
    state.email = user.email || 'no email'
    state.phoneNumber = user.phoneNumber || 'no phone'
    state.photoUrl = user.photoURL || 'https://seller-koi.web.app/img/seller.2915641c.png'
  },
  unset_user_data (state: IUserState): void {
    state.uid = ''
    state.displayName = ''
    state.email = 'no email'
    state.phoneNumber = 'no phone'
    state.photoUrl = 'https://seller-koi.web.app/img/seller.2915641c.png'
  },
  set_logout (state: IUserState): void {
    state.token = ''
    state.expiryToken = 0
    localStorage.setItem('expiryToken', '')
    localStorage.setItem('token', '')
    state.isLogin = false
    state.role = []
  },
  set_token (state: IUserState, data: Pick<IUserState, 'token' | 'expiryToken'>): void {
    state.token = data.token
    localStorage.setItem('token', data.token)
    state.expiryToken = data.expiryToken
    localStorage.setItem('expiryToken', data.expiryToken.toString())
  }
}

export type UserMutation = typeof mutations
type Context = Commit<UserMutation> & { state: IUserState }

const actions = {
  async login (store: Context, user: firebase.User): Promise<void> {
    const commit = store.commit

    const token = await user.getIdTokenResult()
    commit('set_token', {
      token: token.token,
      expiryToken: Date.parse(token.expirationTime)
    })

    commit('set_user_data', user)
    commit('set_login', true)

    // getting aksess
    const access = await getAccess(user.uid)
    if (access) {
      commit('set_access', access)
    }
  },
  async reloadToken (store: Context): Promise<void> {
    const user = auth.currentUser
    const state = store.state
    const commit = store.commit

    if (user) {
      const token = await user.getIdTokenResult(true)
      commit('set_token', {
        token: token.token,
        expiryToken: Date.parse(token.expirationTime)
      })
      state.isLogin = true
    }
  },

  logout (store: Commit<UserMutation>): void {
    const commit = store.commit
    commit('set_logout')
    commit('unset_user_data')
  }
}

const user: Module<IUserState, {}> = {
  namespaced: true,
  mutations,
  actions,
  state
}

export default user

export type UserAction = typeof actions
export type UserStore = Store<{ 'user': IUserState }, Namespaced<UserMutation, 'user'>, Namespaced<UserAction, 'user'>>
