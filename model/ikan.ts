/* eslint-disable camelcase */
export interface IIkan {
  id: string
  user_id: string
  dilihat: number
  order_count: number
  gambar: string[]
  video: string
  thumbnail?: string,
  name: string
  price: number
  ukuran: number
  ukuran_range?: {
      min: number
      max: number
  }
  kategori: string
  ship_from: string
  deskripsi: string
  like: number
  city: string
  region: string
  created: number
}

export type IkanKey = keyof IIkan
