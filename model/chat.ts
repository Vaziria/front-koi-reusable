import { Seller } from './seller'
import { IUser } from './user'

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
    send_process?: boolean
    send_error?: boolean
}

export interface UserChatBasic {
    unread: number
    last_msg: Chat
    last_chat: number
    cs_id?: string
    id: string
    name: string
    seller_name: string
    state: string
    photoUrl: string
}

type UserChatUser = UserChatBasic & IUser
type UserChatSeller = UserChatBasic & Seller & { is_seller?: boolean }

export type UserChat = UserChatUser | UserChatSeller | UserChatBasic

export interface ChatOrder {
    id: string
}

export interface ChatProduct {
    id: string
    shopid: string
    name: string
    send_process: boolean
    gambar: string
}
