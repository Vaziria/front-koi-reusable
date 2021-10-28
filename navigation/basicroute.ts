export interface BasicRoute {
    // eslint-disable-next-line camelcase
  product_ikan: {
    params: {
      permaid: string
    }
  }
    // eslint-disable-next-line camelcase
  order_single: {
    params: {
        shopid: string
        id: string
    }
  }
  // eslint-disable-next-line camelcase
  user_chat: {
    params: {
      userid: string
    }
  }
}
