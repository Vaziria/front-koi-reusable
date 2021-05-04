/* eslint-disable camelcase */

export type StatusIkan = 'ready' | 'booked' | 'process' | 'sold' | 'arsip'

export interface IkanChart {
    id: string
    quantity: number
    has_review?: boolean
}

export interface IIkan {
  status: StatusIkan
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
  sex: 'male' | 'female' | 'uncheck'
}

export interface IFormIkan {
  name: string
  sex: 'male' | 'female' | 'uncheck'
  ukuran: number
  'ukuran_range': {
    min: number
    max: number
  }
  'ship_from': string
  deskripsi: string
  kategori: string
  price: number
  gambar: (string | File)[]
  video: string | File
  thumbnail: string
}

export interface PublicIkan extends IIkan {
    me?: {
        wishlist: boolean
    }
}

export type IkanKey = keyof IIkan
