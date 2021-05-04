import { RoleKey } from './access'

type InviteStatus = 'pending' | 'reject'

export interface Invite {
    status: InviteStatus
    id: string
    shopid: string
    role: RoleKey[]
    // eslint-disable-next-line camelcase
    to_id: string
    created: number
}
