/* eslint-disable camelcase */
export interface Diskusi {
    shopid: string
ikanid: string
last_reply?: number
created: number
userid: string
has_reply?: boolean
reply_id?: string
id: string
img_profile: string
name: string
text: string
image?: string

}

export type DiskusiKey = keyof Diskusi