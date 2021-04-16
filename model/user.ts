import { IkanChart } from './product'

/* eslint-disable camelcase */
export interface UserStatus {
    state: string
    last_changed: number
}

export interface PublicUser extends UserStatus {
    id: string
    name: string
    photoUrl?: string
}

export interface IUser {
    id: string
    phone: string
    email: string
    name: string
    add_chart: IkanChart[]
    wishlist: string[]
    photoUrl?: string

}
