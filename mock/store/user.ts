import { getId, getRandomNum, getRandomValue } from '../mock'
import { IUserState } from '../../store/user'
import { RoleKey } from '../../model/access'
import { Wilayah } from '../../constant/wilayah'
import { Module } from 'vuex'

const wilayah = getRandomValue(Wilayah)
const names = ['Agile', 'Kanban', 'Todo']
const name = getRandomValue(names)

export const state: IUserState = {
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

export const mutations = {
  setRole (state: IUserState, roles: RoleKey[]): void {
    state.role = roles
  },

  setShopid (state: IUserState, shopid: string): void {
    state.shopid = shopid
  }
}
export type UserMutation = typeof mutations

// eslint-disable-next-line @typescript-eslint/ban-types
const user: Module<IUserState, {}> = {
  namespaced: true,
  mutations,
  state
}

export default user
