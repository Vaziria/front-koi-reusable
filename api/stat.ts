/* eslint-disable camelcase */
import { StatusOrder } from '../model/order'
import client from './client'

export interface StandartFilter {
    status?: string
    q?: string
    datemin?: number
    datemax?: number
    pay_status?: string
}

export type StatRes = {
  [ key in StatusOrder | 'key' | 'value' ]: key extends 'key' ? string: number
}

export async function generalStat (payload: StandartFilter): Promise<StatRes[]> {
  const res = await client.get('/seller/stat/general', { params: payload })
  const datas = res.data.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasil = datas.map((data: any) => {
    const statuses: {
      [k in StatusOrder]?: number
    }[] = data.status || []

    const key = Object.keys(data)[0]
    const fix = {
      key,
      value: data[key]
    }

    statuses.map(status => {
      Object.assign(fix, status)
    })

    return fix
  })

  return hasil
}

export type PenjualanRes = {
  [ key in StatusOrder | 'total' ]?: number
}

export async function penjualanStat (payload: StandartFilter): Promise<PenjualanRes[]> {
  const res = await client.get('/seller/stat/penjualan', { params: payload })
  return res.data.data
}
