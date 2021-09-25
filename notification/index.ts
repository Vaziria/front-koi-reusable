import firebase from 'firebase'
import api from '../api/client'
import { INotif } from '../model/notifs'

export type Callback = (notif: INotif) => void

export async function setupNotification (callback: Callback): Promise<void> {
  try {
    const messaging = firebase.messaging()
    const token = await messaging.getToken({
      vapidKey: process.env.VUE_APP_VAPID_KEY
    })

    try {
      await api.post('/reg-notif', { token })
      messaging.onMessage((notif) => callback(notif.data))
    } catch (e) {
      console.error(e)
    }
  } catch (e) {
    console.error(e)
  }
}
