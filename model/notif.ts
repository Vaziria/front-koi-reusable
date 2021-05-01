export type NotifType = 'update_order' | 'create_produk' | 'ikan' | 'diskusi' | 'promo' | 'new_chat'

export interface NotifHist {
    id?: string
    title: string
    created: number
    type: NotifType
    body?: string
    unread?: boolean
}
