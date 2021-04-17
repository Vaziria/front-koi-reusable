/* eslint-disable camelcase */
export interface Chat {
    from_id: string
    to_id: string
    created: number
    text?: string
    image?: string
    orderid?: string
    shopid?: string
    productid?: string
    cs_id?: string
    from_seller?: boolean
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
