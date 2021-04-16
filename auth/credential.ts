
import client from '@/reusable/api/client'
import { AxiosRequestConfig } from 'axios'
import { UserStore } from '../store/user'

async function configSetup (config: AxiosRequestConfig, store: UserStore) {
  const now = Date.now()
  const exptoken = store.state.user.expiryToken

  if (now > exptoken) {
    await store.dispatch('user/reloadToken')
  }

  const token: string = store.state.user.token
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }

  return config
}

export function setupCredential (store: UserStore): void {
  client.interceptors.request.use(config => configSetup(config, store),
    error => {
      Promise.reject(error)
    }
  )
}
