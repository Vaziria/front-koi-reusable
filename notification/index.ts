import firebase from 'firebase'
import api from '../api/client'
import { INotif } from '../model/notifs'
import { errorLog } from '../utils/logger'

export type NotifBackground = INotif & {
  isFirebaseMessaging: false
  isBackground?: true,
  isAction?: true
}

type NotifFirebase = {
  data: NotifBackground,
  isFirebaseMessaging: true
}

export type Callback = (notif: NotifBackground) => void

function reTypingNotif (notif: NotifBackground): NotifBackground {
  notif.created = parseInt(notif.created.toString())
  notif.unread = !!notif.unread
  return notif
}

export async function setupNotification (callback: Callback): Promise<void> {
  try {
    const messaging = firebase.messaging()
    const token = await messaging.getToken({
      vapidKey: process.env.VUE_APP_VAPID_KEY
    })

    try {
      await api.post('/reg-notif', { token })
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.onmessage = (data: MessageEvent<NotifBackground | NotifFirebase>) => {
          const notif = data.data

          if (notif.isFirebaseMessaging) {
            return callback(reTypingNotif(notif.data))
          }

          callback(reTypingNotif(notif))
        }
      }
    } catch (e) {
      errorLog(e)
    }
  } catch (e) {
    errorLog(e)
  }
}
