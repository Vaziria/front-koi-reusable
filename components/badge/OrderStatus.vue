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
import { threatTipe, MapValue as MapThreatValue } from '../../constant/threattype'

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

  get threatTipe (): MapThreatValue {
    const findThreatTipe = threatTipe.find(ttipe => ttipe.key === this.order.threat_tipe)
    if (findThreatTipe) {
      return findThreatTipe
    }
    return threatTipe[0]
  }

  get statusName (): string {
    const status = this.status.key

    if (status === 'pending') {
      return this.payStatus.name
    }

    if (status === 'process') {
      return this.threatTipe.name
    }

    return this.status.name
  }

  get statusClass (): string {
    const status = this.status.key

    if (status === 'pending') {
      return this.payStatus.class
    }

    if (status === 'process') {
      return this.threatTipe.class
    }

    return this.status.class
  }
}

export default OrderStatus
</script>
