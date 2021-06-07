export interface BasicRoute {
    // eslint-disable-next-line camelcase
    product_ikan: {
        params: {
          ikanid: string
          shopid: string
        }
      }
    // eslint-disable-next-line camelcase
    order_single: {
    params: {
        shopid: string
        id: string
    }
    }
}
