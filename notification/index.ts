import firebase from 'firebase'
import api from '../api/client'
import { Notif } from '../model/notif'

export type Callback = (notif: Notif) => void

export async function setupNotification (callback: Callback): Promise<void> {
  try {
    const messaging = firebase.messaging()
    const token = await messaging.getToken({
      vapidKey: 'BPkJ7JjX4xqRTTaXqcGHGdY5JTMQvxkyl16N2gI05hLHkcBFCf7d8lt_kEh_vfpJAgpOvx7gPE1FkScSeKWmY18'
    })

    try {
      await api.post('/reg-notif', { token })
      messaging.onMessage((notif) => callback(notif.data))
    } catch (e) {
      console.log(e)
    }
  } catch (e) {
    console.log(e)
  }
}
