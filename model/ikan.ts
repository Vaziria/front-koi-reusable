/* eslint-disable camelcase */

import { Seller } from './seller'

export const listStatusIkan = ['ready', 'booked', 'process', 'sold', 'arsip', 'draft'] as const
export type StatusIkan = typeof listStatusIkan[number]

export interface IkanChart {
    id: string
    quantity: number
    has_review?: boolean
}

export interface IIkan {
  status: StatusIkan
  id: string
  permalink_id: string
  user_id: string
  view?: number
  order_count: number
  gambar: string[]
  video: string
  video_code: string
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
  seller: Seller
  youtubeVideo: string
}

export interface IFormIkan {
  status?: StatusIkan
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
  gambar: string[]
  video: string | File
  thumbnail: string
  youtubeVideo: string
}

export interface PublicIkan extends IIkan {
    bidable?: boolean
    me?: {
        wishlist: boolean
    }
}

export interface CartIkan extends IIkan {
  quantity: number
}

export type IkanKey = keyof IIkan
