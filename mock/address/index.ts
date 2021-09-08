import { Address } from '../../model/order'
import { getId, getRandomValue, getPhone } from '../mock'

export function single (): Address {
  const alamats = ['Jl. Kenari no.16 RT 3 RW 5', 'Jalan Soekarno no 55', 'Gg Mawar 03, Perum Sidoasri']
  const buyerNames = ['Asep', 'Rehan', 'Cecep', 'Lastri', 'Parjo']
  const districts = ['Mojang', 'Kepanjen', 'Ngodang', 'Pakisaji', 'Karangploso', 'Sumberjo', 'Nglegok', 'Srengat']
  const postalCodes = ['66114', '63323', '66741', '60156', '66666']
  const provinces = ['Jawa Timur', 'Jawa Barat', 'Jawa Tengah']
  const regions = ['Blitar', 'Malang', 'Yogyakarta', 'Jakarta', 'Palembang']

  return {
    alamat: getRandomValue(alamats),
    buyer_name: getRandomValue(buyerNames),
    district: getRandomValue(districts),
    id: getId(11),
    phone_number: getPhone(),
    postal_code: getRandomValue(postalCodes),
    province: getRandomValue(provinces),
    region: getRandomValue(regions)
  }
}
