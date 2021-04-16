import firebase from 'firebase'
import client from '@/reusable/api/client'
import { setupPresence } from '@/reusable/user/presence'
import { UserStore } from '../store/user'
import { db, realdb } from '@/utils/firebase'
// import { subChat } from '@/firedb/chat'

// async function getAccess (uid: string) {
//   const access = await db.collection('Access').doc(uid).get()

//   if (access.exists) {
//     return access.data()
//   }

//   return false
// }

export class AuthUser {
  auth!: firebase.auth.Auth
  store!: UserStore

  constructor (auth: firebase.auth.Auth, store: UserStore) {
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
    }
  }

  registerAuthRouter (): void {
    this.auth.onAuthStateChanged((user) => this.userStateChanged(user))
  }
}

export async function getUser (userid: string): Promise<void> {
  return await client.get(`/user/${userid}`)
}
