/* eslint-disable camelcase */
export const kurirType = ['bis', 'pesawat', 'travel'] as const

export type IKurirType = typeof kurirType[number]

export interface IShippingData {
  type: IKurirType
  resi?: string
  resi_media?: string[]
  kurir_contact?: string
}
