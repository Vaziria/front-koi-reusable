import firebase from 'firebase'
import { setupPresence } from '../../reusable/user/presence'
import { UserStore } from '../store/user'
import { db, realdb } from '../../utils/firebase'
import { Access } from '../model/access'
import { ChatStore } from '../store/chat'
import { setupNotification } from '../notification'
import { NotifStore } from '../store/notif'
import { specialLog } from '../utils/logger'
import { OrderstatStore } from '../store/orderstat'
import { INotif } from '../model/notifs'

type Store = UserStore & ChatStore & NotifStore & OrderstatStore
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

  orderStatNotif (notif: INotif): void {
    switch (notif.type) {
      case ('new_order'): {
        this.store.commit('orderstat/add_wait_count', 1)
        break
      }

      case ('confirm_order'): {
        this.store.commit('orderstat/add_wait_count', -1)
        this.store.commit('orderstat/add_unpaid_count', 1)
        break
      }

      case ('process_order'): {
        this.store.commit('orderstat/add_unverif_count', -1)
        this.store.commit('orderstat/add_ready_send_count', 1)
        break
      }

      case ('karantina_order'): {
        this.store.commit('orderstat/add_ready_send_count', -1)
        this.store.commit('orderstat/add_karantina_count', 1)
        break
      }

      case ('titip_order'): {
        this.store.commit('orderstat/add_ready_send_count', -1)
        this.store.commit('orderstat/add_titip_count', 1)
        break
      }

      case ('unverify_paid'): {
        this.store.commit('orderstat/add_unverif_count', 1)
        this.store.commit('orderstat/add_unpaid_count', -1)
        break
      }
    }
  }

  async setupNotification (userid: string): Promise<void> {
    specialLog('setup notif', userid)
    await setupNotification((notif) => {
      if (!notifids.includes(notif.id)) {
        notifids.push(notif.id)
        if (notif.type === 'new_chat') {
          this.store.commit('chat/add_unread', 1)
        } else {
          this.store.commit('notif/push_new_notif', notif)
        }
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
