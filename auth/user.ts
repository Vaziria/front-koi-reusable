import firebase from 'firebase'
import { setupPresence } from '../../reusable/user/presence'
import { UserStore } from '../store/user'
import { db, realdb } from '../../utils/firebase'
import { Access } from '../model/access'
import { ChatStore } from '../store/chat'
import { setupNotification } from '../notification'
import { NotifStore } from '../store/notif'
import { specialLog } from '../utils/logger'

type Store = UserStore & ChatStore & NotifStore
const notifids: string[] = []

export async function getAccess (uid: string): Promise<Access | null> {
  const doc = await db.collection('Access').doc(uid).get()
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

  async setupNotification (userid: string): Promise<void> {
    specialLog('setup notif', userid)
    await setupNotification((notif) => {
      if (!notifids.includes(notif.id)) {
        notifids.push(notif.id)
        this.store.commit('notif/push_new_notif', notif)
      }
    })
  }

  async userStateChanged (user: firebase.User | null): Promise<void> {
    if (user) {
      specialLog('logining user', user)

      await this.store.dispatch('user/login', user)
      await this.setupNotification(user.uid)
      setupPresence(user.uid, db, realdb)
    } else {
      this.store.commit('user/set_logout')
      this.store.commit('chat/reset_message')
      this.store.commit('chat/reset_user')
    }
  }

  registerAuthRouter (callback?: (user: firebase.User|null) => void|Promise<void>): void {
    this.auth.onAuthStateChanged((user) => {
      callback && callback(user)
      this.userStateChanged(user)
    })
  }
}
