import { BuyerOrder, listStatusOrder, Order } from '../../model/order'
import { single as singleAddress } from '../address'
import { single as singleIkan } from '../ikan'
import { single as singleSeller } from '../seller'
import { getRandomValue, getRandomNum, getPhone, getId } from '../mock'

export function getBuyer (): BuyerOrder {
  const firstName = getRandomValue(['Yayan', 'Wawan', 'Jarwo', 'Laskmi', 'Narko'])
  const lastName = getRandomValue(['Suherman', 'Wijoyo', 'Karman', 'Sudarsono', 'Wenchester'])
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${getRandomNum(100)}@gmail.com}`

  return {
    email,
    id: getId(20),
    name: [firstName, lastName].join(' '),
    phone: getPhone()
  }
}

export function single (orderStatus?: Order['status'], orderPayStatus?: Order['pay_status']): Order {
  const statuses: Order['status'][] = [...listStatusOrder]
  const payStatuses: Order['pay_status'][] = ['unpaid', 'paid', 'unverify']
  const payChannel = getRandomValue(['BCA', 'BRI', 'BNI', 'MANDIRI'])

  const status = orderStatus || getRandomValue<Order['status']>(statuses)
  const payStatus = orderPayStatus || getRandomValue(payStatuses)
  let buktiPembayaran = ''
  const ikans = [singleIkan()]
  const subTotal = ikans.reduce((res, item) => {
    res += item.price
    return res
  }, 0)

  if (status !== 'waitverif' && payStatus !== 'unpaid') {
    buktiPembayaran = 'https://mybillbook.in/blog/wp-content/uploads/2021/04/sample-thermal-printer-bill-format.png'
  }

  return {
    address: singleAddress(),
    bukti_pembayaran: buktiPembayaran,
    buyer: getBuyer(),
    cancel_reason: '',
    created: new Date().getTime(),
    diskon: 0,
    id: getId(11),
    ikans,
    note: '',
    note_admin: '',
    ongkir: 0,
    pay_channel: payChannel,
    pay_method: 'transfer',
    pay_status: payStatus,
    seller: singleSeller(),
    shopid: getId(11),
    status,
    sub_total: subTotal,
    target_kirim: 0,
    total: subTotal
  }
}

export function getAllStatus (defStatus?: (Order['status'] | ''), defPayStatus?: (Order['pay_status'] | '')): Order[] {
  return Array.from(Array(10))
    .map(() => {
      return single(defStatus || undefined, defPayStatus || undefined)
    })
}
