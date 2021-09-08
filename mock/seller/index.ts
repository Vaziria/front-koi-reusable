import { Seller } from '../../model/seller'
import { getRandomValue, getRandomNum, getId, getPhone } from '../mock'
import { Wilayah } from '../../constant/wilayah'

const wilayah = getRandomValue(Wilayah)

export function single (): Seller {
  return {
    city: wilayah.region,
    created: new Date().getTime(),
    id: getId(11),
    ikan_count: getRandomNum(100),
    ikan_limit: 100,
    last_stat_up: getRandomNum(100),
    like_count: new Date().getTime(),
    location: '',
    order_count: getRandomNum(25),
    phone: getPhone(),
    profile_image: '',
    region: wilayah.province,
    review_count: getRandomNum(25),
    seller_name: 'Seller Test',
    transaction: getRandomNum(25),
    state: 'online',
    photoUrl: ''
  }
}
