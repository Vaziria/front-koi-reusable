import { IIkan } from './ikan'

export interface Order {
    id: string
    ikans: IIkan[]
    total: number
    status: string
}
