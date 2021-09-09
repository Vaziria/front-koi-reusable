import { IShippingData, IKurirType } from '../../model/shipping'
import { getId, getRandomValue, getPhone } from '../mock'

export function single (): IShippingData {
  const resi = ['https://cekresi.com/images/digit-contoh-resi-jx-jd-id.jpg']

  return {
    type: getRandomValue<IKurirType>(['bis', 'pesawat', 'travel']),
    resi: getId(15),
    resi_media: resi,
    kurir_contact: getPhone()
  }
}
