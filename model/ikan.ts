/* eslint-disable camelcase */

import { Seller } from "./seller"

export const listStatusIkan = ['ready', 'booked', 'process', 'sold', 'arsip'] as const
export type StatusIkan = typeof listStatusIkan[number]

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
  tags?: string[]
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
    bidable?: boolean
    seller: Seller
    me?: {
        wishlist: boolean
    }
}

export interface CartIkan extends IIkan {
  seller: Seller
  quantity: number
}

export type IkanKey = keyof IIkan
