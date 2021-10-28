<template>
  <div :class="{
    'az-msg-wrapper bd rounded-5 p-2 d-block': true,
    'bd-info': selfChat,
    'bg-gray-200': !selfChat,
    'op-5': unsend
  }">
    <div class="d-flex mb-2 pointer" @click="toInvoice()">
      <div class="mr-3 align-self-start">
        <img
          :src="image"
          class="wd-70 ht-70 img-fit-cover rounded-10 shadow bd"
        >
      </div>
      <div class="align-self-center lh-1">
        <p class="mb-1 tx-12 wd-200 text-truncate tx-uppercase">INVOICE#{{ order.id }}</p>
        <b class="mb-1 d-block">{{ order.total | currency }}</b>
        <OrderStatus
          v-if="order.id"
          :order="order"
          class="tx-10"
        />
        <div v-else class="badge badge-light tx-12 tx-bold px-3">
          ...
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.az-msg-wrapper {
  background: rgba(255, 255, 255, .5) !important;
  color: #3b4863 !important;
}

.ht-70 {
  height: 70px !important;
}

.tx-10 {
  font-size: 10px !important;
}
</style>
<script lang="ts">
import { Order } from '../../../model/order'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { errorLog } from '../../../utils/logger'
import { ISystemState } from '../../../store/system'
import { Store } from '../../../store/types'
import VueWithStore from '../../../store/wrapper.vue'
import WithNav from '../../../navigation/WithNav.vue'
import { BasicRoute } from '../../../navigation/basicroute'
import WithRootEmit from '../../../event/WithRootEmit.vue'
import { BasicRootEvent } from '../../../event/basicRootEvent'
import Loading from '../../../mixins/Loading.vue'
import currency from '../../../filters/currency'
import { invoice } from '../../../api/order'
import OrderStatus from '../../../components/badge/OrderStatus.vue'

type OrderChat = Pick<Order,
  'id'
  | 'ikans'
  | 'total'
  | 'status'
  | 'pay_status'
  | 'threat_tipe'
>

type State = {
  'system': ISystemState
}
// eslint-disable-next-line @typescript-eslint/ban-types
type ChatStore = Store<State, {}, {}>

@Component
class StoreMix extends VueWithStore<ChatStore> {}

@Component
class NavMix extends WithNav<BasicRoute> {}

@Component
class RootEmitMix extends WithRootEmit<BasicRootEvent> {}

@Component({
  components: {
    OrderStatus
  },
  filters: {
    currency
  }
})
class OrderDialog extends Mixins(Loading, StoreMix, NavMix, RootEmitMix) {
  @Prop() readonly unsend!: boolean
  @Prop({}) readonly orderid!: string
  @Prop({}) readonly shopid!: string
  @Prop({}) readonly selfChat!: boolean

  order: OrderChat = {
    id: '',
    ikans: [],
    total: 0,
    status: 'waitverif',
    pay_status: 'unpaid',
    threat_tipe: 'titip'
  }

  get image (): string {
    if (this.order.id) {
      return this.order.ikans[0].gambar[0]
    }

    return 'https://developers.google.com/maps/documentation/maps-static/images/error-image-generic.png?hl=id'
  }

  async mounted (): Promise<void> {
    try {
      const order = await invoice({
        shopid: this.shopid,
        oid: this.orderid
      })
      this.order = {
        ...this.order,
        ...order
      }
    } catch (e) {
      this.order.id = 'Order tidak ditemukan'
      errorLog(e)
    }
  }

  async toInvoice (): Promise<void> {
    this.navigation.push('order_single', {
      params: {
        shopid: this.shopid,
        id: this.orderid
      }
    })
  }
}

export default OrderDialog

</script>
