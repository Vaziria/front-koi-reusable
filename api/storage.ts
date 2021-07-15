import store from '../../store'
import firebase from 'firebase'
const storage = firebase.storage()

export type TSnapshot = (snapshot: firebase.storage.UploadTaskSnapshot) => void

interface ITaskProps {
  file: File
  snapshot?: TSnapshot
  path: string
}

type StorageError = 'storage/object-not-found'

export class Tasker {
  file: File
  snapshot?: TSnapshot
  path: string

  constructor (props: ITaskProps) {
    const { file, snapshot, path } = props
    this.file = file
    this.snapshot = snapshot
    this.path = path
  }

  get task (): firebase.storage.UploadTask {
    const storePath = `${this.path}/${this.file?.name.replace(/ /g, '_')}`
    return storage.ref(storePath).put(this.file)
  }

  getDownloadUrl (task: firebase.storage.UploadTask): Promise<string> {
    if (task.snapshot) {
      return task.snapshot?.ref.getDownloadURL()
    }
    return new Promise<string>((resolve) => resolve(''))
  }

  stateChanged (): Promise<string> {
    return new Promise((resolve, reject) => {
      const task = this.task
      task.on(
        'state_changed',
        this.snapshot || null,
        (error) => reject(error),
        async () => resolve(await this.getDownloadUrl(task))
      )
    })
  }
}

export async function deleteFile (url: string): Promise<void> {
  const filePath = url
    .replace('https://firebasestorage.googleapis.com/v0/b/pdc-koi.appspot.com/o', '') // remove url
    .replace(/ /g, '_') // replace space to underscore
    .replace(/%2F/g, '/') // slashing path
    .split('?alt=media')[0]

  try {
    await storage.ref(filePath).delete()
  } catch (e) {
    const code = e.code as StorageError

    if (code === 'storage/object-not-found') {
      console.log('not found')
    } else {
      throw (e)
    }
  }
}

export function uploadAvatar (file: File, snapshot?: TSnapshot): Promise<string> {
  const task = new Tasker({
    file,
    snapshot,
    path: '/profile'
  })
  return task.stateChanged()
}

export function uploadBuktiPembayaran (file: File, snapshot?: TSnapshot): Promise<string> {
  const task = new Tasker({
    file,
    snapshot,
    path: '/bukti_pembayaran'
  })
  return task.stateChanged()
}
