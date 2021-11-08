import { Chat } from '../../model/chat'
import { getId, getRandomNum } from '../mock'

// eslint-disable-next-line camelcase
export function single (shopid?: string, cs_id?: string): Chat {
  let productid
  let orderid
  // eslint-disable-next-line camelcase
  const from_seller = !!shopid

  if (getRandomNum(2) < 2) {
    productid = getId(11)
  } else {
    orderid = getId(11)
  }

  return {
    id: getId(11),
    from_id: getId(11),
    to_id: getId(11),
    created: new Date().getTime(),
    text: 'test chat',
    orderid,
    productid,
    shopid,
    cs_id,
    from_seller
  }
}
