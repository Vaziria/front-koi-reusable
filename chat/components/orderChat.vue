<template>
  <div v-if="order != null">
    <div class="d-flex" @click="toInvoice()">
      <div
        :class="{ 'wd-50 ht-50 img-ikan mr-3 rounded-10 shadow bd': true, 'wd-md-70 ht-md-70': !mini }"
        :style="displayImage"
      ></div>
      <div>
        <p class="mb-0 wd-150 ellipsis">{{ order.id }}</p>
        <b>{{ order.total | currency }}</b>
        <p class="mb-0"><mdb-icon icon="tag" /> {{ order.status }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.d-flex {
  cursor: pointer;
}
.img-ikan {
  background-size: cover !important;
  background-position: 50% !important;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<script lang="ts">
import { mdbIcon } from 'mdbvue'
import currency from '../../filters/currency'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Order } from '../../model/order'
import { invoice } from '../../api/order'
import VueWithStore from '../../store/wrapper.vue'
import { Namespaced, Store } from '../../store/types'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'
import { ISystemState } from '../../store/system'
import { IUserState } from '../../store/user'
import { BasicRoute } from '@/reusable/navigation/basicroute'
import WithNav from '@/reusable/navigation/WithNav.vue'

type State = {
    'chat': IChatState
    'system': ISystemState
    'user': IUserState
}

type ChatStore = Store<State, Namespaced<ChatMutation, 'chat'>, Namespaced<ChatAction, 'chat'>>

@Component
class StoreMix extends VueWithStore<ChatStore> {}

@Component
class NavMix extends WithNav<BasicRoute> {}

@Component({
  components: {
    mdbIcon
  },
  filters: {
    currency
  }
})
export default class OrderChat extends Mixins(NavMix, StoreMix) {
  @Prop({}) readonly orderid!: string
  @Prop({}) readonly shopid!: string

  order: Order | null = null

  get fromId (): string {
    if (this.tstore.state.system.isSeller) {
      return this.tstore.state.user.shopid
    }
    return this.shopid
  }

  get userid (): string {
    return this.tstore.state.user.uid
  }

  async mounted (): Promise<void> {
    try {
      this.order = await invoice({
        shopid: this.fromId,
        oid: this.orderid
      })
    } catch (e) {
      console.error('error getting invoice')
    }
  }

  get mini (): boolean {
    return this.tstore.state.system.isMobile
  }

  get isSeller (): boolean {
    return this.tstore.state.system.isSeller
  }

  get displayImage (): { 'background-image'?: string } {
    try {
      return {
        'background-image': `url(${this.order?.ikans[0].gambar[0]})`
      }
    } catch (e) {
      return {}
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

</script>
