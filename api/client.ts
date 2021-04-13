
import store from '@/store'
import axios, { AxiosRequestConfig } from 'axios'

const client = axios.create({
  baseURL: process.env.VUE_APP_API_BASE,
  // withCredentials: true,
  timeout: 120000
})

export default client

export interface StdRes {
  msg: string
}
