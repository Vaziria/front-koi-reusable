import firebase from 'firebase'
import { setupPresence } from '../../reusable/user/presence'
import { UserStore } from '../store/user'
import { db, realdb } from '../../utils/firebase'
import { Access } from '../model/access'
import { ChatStore } from '../store/chat'
// import { subChat } from '@/firedb/chat'

type Store = UserStore & ChatStore

export async function getAccess (uid: string): Promise<Access | null> {
  const doc = await db.collection('Access').doc(uid).get()
  // console.log('uid', uid, doc.data())
  if (doc.exists) {
    const data = doc.data()
    const access: Access = data as Access
    return access
  }

  return null
}

export class AuthUser {
  auth!: firebase.auth.Auth
  store!: Store

  constructor (auth: firebase.auth.Auth, store: Store) {
    this.auth = auth
    this.store = store
  }

  async logout (): Promise<void> {
    return await this.auth.signOut()
  }

  async userStateChanged (user: firebase.User | null): Promise<void> {
    if (user) {
      if (process.env.NODE_ENV !== 'production') console.log('data_user:', user)
      console.log('logining user')

      await this.store.dispatch('user/login', user)
      setupPresence(user.uid, db, realdb)
      // subChat(user.uid)
    } else {
      this.store.commit('user/set_logout')
      this.store.commit('chat/reset_msg')
      this.store.commit('chat/reset_user')
    }
  }

  registerAuthRouter (): void {
    this.auth.onAuthStateChanged((user) => this.userStateChanged(user))
  }
}
