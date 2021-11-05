import { getId, getRandomNum, getRandomValue } from '../mock'
import userStore, { IUserState, UserMutation, UserAction } from '../../store/user'
import { Wilayah } from '../../constant/wilayah'
import { Module } from 'vuex'

export {
  IUserState,
  UserMutation,
  UserAction
}

const wilayah = getRandomValue(Wilayah)
const names = ['Agile', 'Kanban', 'Todo']
const name = getRandomValue(names)

export const state: IUserState = {
  ...userStore.state,
  uid: getId(11),
  token: getId(30),
  expiryToken: new Date().getTime() + (24 * 3600 * 1000),
  isLogin: true,
  role: [],
  displayName: name,
  email: `${name}.${getRandomNum(100)}@mail.com`,
  phoneNumber: `08${getRandomValue(['56', '53', '95'])}${getRandomValue(['8213214477', '1118219477', '5454321247'])}`,
  photoUrl: '',
  shopid: '',
  kota: wilayah.region,
  unsetting: false
}

// eslint-disable-next-line @typescript-eslint/ban-types
const user: Module<IUserState, {}> = {
  namespaced: true,
  mutations: userStore.mutations,
  actions: userStore.actions,
  state
}

export default user
