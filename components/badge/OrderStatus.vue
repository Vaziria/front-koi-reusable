<template>
  <div :class="`badge badge-pill badge-${statusClass} tx-12 tx-bold px-3`">
    {{ statusName }}
  </div>
</template>
<script lang="ts">
import { Order } from '../../model/order'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { orderStatus, MapValue } from '../../constant/orderstatus'
import { orderPayStatus, MapValue as MapPayValue } from '../../constant/orderpaystatus'

@Component
class OrderStatus extends Vue {
  @Prop() readonly order!: Order

  get status (): MapValue {
    const findStatus = orderStatus.find(status => status.key === this.order.status)
    if (findStatus) {
      return findStatus
    }
    return orderStatus[0]
  }

  get payStatus (): MapPayValue {
    const findPayStatus = orderPayStatus.find(payStatus => payStatus.key === this.order.pay_status)
    if (findPayStatus) {
      return findPayStatus
    }
    return orderPayStatus[0]
  }

  get statusName (): string {
    const status = this.status.key
    const payStatus = this.payStatus.key

    if (status === 'pending') {
      if (payStatus === 'unpaid') {
        return this.payStatus.name
      } else if (payStatus === 'unverify') {
        return this.payStatus.name
      }
    }

    return this.status.name
  }

  get statusClass (): string {
    const status = this.status.key
    const payStatus = this.payStatus.key

    if (status === 'pending') {
      if (payStatus === 'unpaid') {
        return this.payStatus.class
      } else if (payStatus === 'unverify') {
        return this.payStatus.class
      }
    }

    return this.status.class
  }
}

export default OrderStatus
</script>
