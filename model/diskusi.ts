/* eslint-disable camelcase */
export interface Diskusi {
  shopid: string
  ikanid: string
  last_reply?: number
  created: number
  userid: string
  has_reply?: boolean
  replied?: boolean
  reply_id?: string
  id: string
  img_profile: string
  name: string
  text: string
  image?: string
}

export interface IDiskusi extends Diskusi {
  replies: Diskusi[]
  show_reply?: boolean
}

export type DiskusiKey = keyof Diskusi
