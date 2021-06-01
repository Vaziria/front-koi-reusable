import { Order, PaidStatus, StatusOrder } from '../model/order'
import client from './client'

export interface FilterBuyerPageOrder {
    q: string
    status: StatusOrder | ''
    // eslint-disable-next-line camelcase
    pay_status: PaidStatus | ''
    datemin: number
    datemax: number
    offset: number
    limit: number
    // eslint-disable-next-line camelcase
    order_type: 'desc' | 'asc'
    order: 'created' | 'total'
  }

export async function listOrder (query: Partial<FilterBuyerPageOrder>): Promise<Order[]> {
  const res = await client.get('/buyer/order', { params: query })
  return res.data
}
