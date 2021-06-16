import { IkanChart } from './ikan'

/* eslint-disable camelcase */
export interface UserStatus {
    state: string
    last_changed: number
}

export interface PublicUser extends UserStatus {
    id: string
    name: string
    phone?: string
    kota?: string
    email?: string
    photoUrl?: string
    unsetting: boolean
}

export interface IUser {
    id: string
    phone: string
    kota?: string
    email: string
    name: string
    add_chart: IkanChart[]
    wishlist: string[]
    photoUrl?: string
}
