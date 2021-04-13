import firebase from 'firebase'
import { db, realdb } from '../../utils/firebase'
import { isOfflineForFirestore, isOfflineForDatabase, isOnlineForDatabase, isOnlineForFirestore } from '../../auth/user'

export function setupPresence (uid: string): void {
  const dbref = db.collection('UserStatus').doc(uid)
  const userrl = firebase.database().ref('/status/' + uid)

  realdb.ref('.info/connected').on('value', (snapshot) => {
    if (process.env.NODE_ENV !== 'production') { console.log('user_snapshot:', snapshot.val()) }

    if (snapshot.val() === false) {
      // Instead of simply returning, we'll also set Firestore's state
      // to 'offline'. This ensures that our Firestore cache is aware
      // of the switch to 'offline.'
      dbref.set(isOfflineForFirestore, { merge: true })
      return
    }

    userrl.onDisconnect().set(isOfflineForDatabase).then(() => {
      userrl.set(isOnlineForDatabase)

      // We'll also add Firestore set here for when we come online.
      dbref.set(isOnlineForFirestore, { merge: true })
    })
  })
}
