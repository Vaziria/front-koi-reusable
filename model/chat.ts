import { Order } from './order'
import { Ikan } from './product'

/* eslint-disable camelcase */
export interface Chat {
    id: string
    from_id: string
    to_id: string
    created: number
    text?: string
    image?: string
    orderid?: string
    productid?: string
    shopid?: string
    cs_id?: string
    from_seller?: boolean
    product?: Ikan
    order?: Order
}

export interface UserChat {
    unread: number
    last_msg: Chat
    last_chat: number
    cs_id?: string
    id: string
    name: string
    seller_name: string
}

export interface ChatOrder {
    id: string
}

export interface ChatProduct {
    id: string
    name: string
    send_process: boolean
}
