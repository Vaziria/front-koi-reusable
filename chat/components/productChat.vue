<template>
  <div>
    <a v-if="!notFound" class="d-flex" @click="toIkan()">
      <div
        :class="{ 'wd-50 ht-50 img-ikan mr-3 rounded-10 shadow bd': true, 'wd-md-70 ht-md-70': !mini }"
        :style="displayImage"
      >
      </div>
      <div>
      <p class="mb-0 wd-150 ellipsis">{{ product.name }}</p>
      <b>{{ product.price | currency }}</b>
      <p class="mb-0"><mdb-icon icon="tag" /> {{ product.kategori }}</p>
      </div>
    </a>
    <div v-else class="d-flex mr-3">
      <mdb-icon icon="exclamation-triangle" class="tx-40 mr-3 mb-1" />
      <div>
        <p class="mb-0 tx-bold">Produk tidak ditemukan</p>
        <p class="mb-0 tx-12">Produk sudah dihapus oleh penjual</p>
      </div>
    </div>
    <div v-if="showAction" class="d-flex tx-dark tx-14 mt-2">
      <span
        class="mg-l-auto px-3 py-1 rounded-5 bg-white tx-bold"
        @click="loadingwait(wishlist(product))"
      ><mdb-icon :icon="`heart ${ isWish && 'tx-info' }`" /></span>

      <span
        class="mg-l-3 px-3 py-1 rounded-5 bg-white tx-bold"
        @click="loadingwait(addCart(product))"
      ><mdb-icon icon="cart-plus" /></span>
    </div>
  </div>
</template>
<style scoped>
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

import { Mixins, Component, Prop } from 'vue-property-decorator'
import { mdbIcon } from 'mdbvue'

import currency from '../../filters/currency'
import Loading from '../../mixins/Loading.vue'
import { PublicIkan } from '../..//model/ikan'
import { publicGetIkan } from '../..//api/ikan'
import client from '../../api/client'
import VueWithStore from '../../store/wrapper.vue'
import { Namespaced, Store } from '../../store/types'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'
import { ISystemState } from '../../store/system'
import { IUserState } from '../../store/user'
import WithNav from '@/reusable/navigation/WithNav.vue'
import { BasicRoute } from '@/reusable/navigation/basicroute'
import { addWish, removeWish } from '@/reusable/api/product'
import WithRootEmit from '@/reusable/event/WithRootEmit.vue'
import { BasicRootEvent } from '@/reusable/event/basicRootEvent'

type State = {
    'chat': IChatState,
    'system': ISystemState,
    'user': IUserState
}
type ChatStore = Store<State, Namespaced<ChatMutation, 'chat'>, Namespaced<ChatAction, 'chat'>>

@Component
class StoreMix extends VueWithStore<ChatStore> {}

type IkanChat = Pick<PublicIkan, 'id' | 'gambar' | 'name' | 'kategori' | 'price' | 'me'>

@Component
class NavMix extends WithNav<BasicRoute> {}

@Component
class RootEmitMix extends WithRootEmit<BasicRootEvent> {}

@Component({
  components: {
    mdbIcon
  },
  filters: {
    currency
  }
})
export default class ProductChat extends Mixins(Loading, StoreMix, NavMix, RootEmitMix) {
  @Prop({}) readonly productid!: string
  @Prop({}) readonly shopid!: string
  product: IkanChat = {
    id: '',
    name: '',
    price: 0,
    kategori: '',
    gambar: [],
    me: {
      wishlist: false
    }
  }

  notFound = false

  get fromId (): string {
    if (this.shopid) {
      return this.shopid
    }
    if (!this.tstore.state.system.isSeller) {
      return this.tstore.state.chat.userActive.id
    }
    return this.tstore.state.user.uid
  }

  get mini (): boolean {
    return this.tstore.state.system.isMobile
  }

  get showAction (): boolean {
    return !this.mini && !this.tstore.state.system.isSeller && !this.notFound
  }

  get isWish (): boolean {
    return this.product.me?.wishlist || false
  }

  get displayImage (): { 'background-image'?: string } {
    if (this.product?.gambar) {
      return {
        'background-image': `url("${this.product.gambar[0]}")`
      }
    }
    return {}
  }

  async mounted (): Promise<void> {
    try {
      const product = await publicGetIkan(this.fromId, this.productid)
      this.product = product
    } catch (e) {
      console.error('product error')
      this.notFound = true
    }
  }

  toIkan (): void {
    if (this.tstore.state.system.isSeller) {
      open(`${process.env.VUE_APP_FRONT_URL}/product/ikan/${this.shopid}/${this.productid}`)
    } else {
      this.navigation.push('product_ikan', {
        params: {
          ikanid: this.productid,
          shopid: this.shopid
        }
      })
    }
  }

  async wishlist (): Promise<void> {
    const id = this.product?.id
    if (!id) {
      return
    }

    if (this.isWish) {
      await removeWish(this.shopid, id)
      this.product.me = {
        ...this.product.me,
        wishlist: false
      }
    } else {
      this.product.me = {
        ...this.product.me,
        wishlist: true
      }
      await addWish(this.shopid, id)
    }
  }

  async addCart (): Promise<void> {
    await client.put(`/chart/${this.product?.id}`, {
      quantity: 1
    })
    this.rootEmit('addChart', this.product)
  }
}

</script>
