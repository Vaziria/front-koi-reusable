import axios from 'axios'

const {
  VUE_APP_API_BASE,
  VUE_APP_API_ELASTIC,
  VUE_APP_ELASTIC_USER,
  VUE_APP_ELASTIC_PASS
} = process.env

const client = axios.create({
  baseURL: VUE_APP_API_BASE,
  // withCredentials: true,
  timeout: 120000
})

export const elasticClient = axios.create({
  baseURL: VUE_APP_API_ELASTIC,
  timeout: 120000,
  withCredentials: true,
  auth: {
    username: VUE_APP_ELASTIC_USER,
    password: VUE_APP_ELASTIC_PASS
  }
})

export default client

export interface StdRes {
  msg: string
}
