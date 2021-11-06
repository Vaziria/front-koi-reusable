import { IDiskusi } from '../../model/diskusi'
import { single as singleDiskusi } from './index'

export function single (shopid = ''): IDiskusi {
  return {
    ...singleDiskusi(shopid),
    replies: [
      singleDiskusi(shopid),
      singleDiskusi(shopid),
      singleDiskusi(shopid)
    ],
    show_reply: false
  }
}

export function multiple (num = 10): IDiskusi[] {
  return Array.from(Array(num))
    .map(() => single())
}
