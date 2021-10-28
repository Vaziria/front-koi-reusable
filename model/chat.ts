import { IIkan } from './ikan'
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

export interface ChatUI extends Chat {
    show_product?: boolean
    show_order?: boolean
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
    profile_image?: string
}

export interface ChatInfoBuyer {
    last_chat: number
    cs_id: string
    last_msg: Chat
    unread: number
}

export interface ChatInfoSeller {
    last_chat: number
    last_msg: Chat
    unread: number
}

type UserChatUser = UserChatBasic & IUser
export type UserChatSeller = UserChatBasic & Seller & { is_seller?: boolean }

export type UserChat = UserChatUser | UserChatSeller | UserChatBasic
export type ChatInfo = ChatInfoBuyer | ChatInfoSeller

export interface ChatOrder {
    id: string
    ikans: IIkan[]
    total: number
}

export interface ChatProduct {
    id: string
    shopid: string
    name: string
    price: number
    send_process: boolean
    gambar: string
}
