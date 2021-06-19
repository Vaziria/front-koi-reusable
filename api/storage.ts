import store from '@/store'
import firebase from 'firebase'
const storage = firebase.storage()

type TSnapshot = (snapshot: firebase.storage.UploadTaskSnapshot) => void

interface ITaskProps {
  file: File
  snapshot?: TSnapshot
  path: string
}

class Tasker {
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
    .replace('https://firebasestorage.googleapis.com/v0/b/pdc-koi.appspot.com/o', '')  // remove url
    .replace(/ /g, '_') // replace space to underscore
    .replace(/%2F/g, '/') // slashing path
    .split('?alt=media')[0]
  return await storage.ref(filePath).delete()
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

export async function uploadProductImage (file: File, snapshot?: TSnapshot): Promise<string> {
  const task = new Tasker({
    file,
    snapshot,
    path: `/product/image/${store.state.user.shopid}`
  })
  return task.stateChanged()
}

export async function uploadProductVideo (file: File, snapshot?: TSnapshot): Promise<string> {
  const task = new Tasker({
    file,
    snapshot,
    path: `/product/video/${store.state.user.shopid}`
  })
  return task.stateChanged()
}

export async function uploadProductThumbnail (file: File, snapshot?: TSnapshot): Promise<string> {
  const task = new Tasker({
    file,
    snapshot,
    path: `/thumbnail/${store.state.user.shopid}`
  })
  return task.stateChanged()
}
