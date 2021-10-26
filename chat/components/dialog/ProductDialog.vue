<template>
  <div :class="{
    'az-msg-wrapper bd rounded-5 p-2 d-block': true,
    'bd-info': selfChat,
    'bg-gray-200': !selfChat,
    'op-5': unsend
  }">
    <div class="d-flex mb-2 pointer" @click="toIkan()">
      <div class="mr-3 align-self-start">
        <img
          :src="product.gambar[0]"
          class="wd-70 ht-70 img-fit-cover rounded-10 shadow bd"
        >
      </div>
      <div class="align-self-center lh-1">
        <p class="mb-1 tx-12 wd-200 text-truncate">{{ product.name }}</p>
        <b class="tx-12 mb-1 d-block">{{ product.price | currency }}</b>
        <p class="mb-0 tx-12"><mdb-icon icon="tag" /> {{ product.kategori }}</p>
      </div>
    </div>

    <div v-if="showAction" class="d-flex">
      <button
        :class="{
          'btn-outline-light': !isWish,
          'btn-outline-info': isWish,
          'btn wd-50p rounded-5 tx-11 tx-bold mr-2': true
        }"
        @click="loadingwait(wishlist())"
      >
        <i class="fa fa-heart"></i>
        Wishlist
      </button>
      <button
        class="btn btn-info wd-50p rounded-5 tx-11 tx-bold"
        @click="loadingwait(addCart())"
      >
        + Keranjang
      </button>
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

.btn {
  min-height: 30px;
  height: 30px;
  padding: 0;
}

.btn-outline-info:active,
.btn-outline-info:focus,
.btn-outline-info:hover {
  background: none;
  color: #e31f52;
}

.btn-outline-light:active,
.btn-outline-light:focus,
.btn-outline-light:hover {
  background: none;
  color: #97a3b9;
}
</style>
<script lang="ts">
import { PublicIkan } from '../../../model/ikan'
import { mdbIcon } from 'mdbvue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { publicGetIkan } from '../../../api/ikan'
import { errorLog } from '../../../utils/logger'
import { addWish, removeWish } from '../../../api/product'
import client from '../../../api/client'
import { ISystemState } from '../../../store/system'
import { Store } from '../../../store/types'
import VueWithStore from '../../../store/wrapper.vue'
import WithNav from '../../../navigation/WithNav.vue'
import { BasicRoute } from '../../../navigation/basicroute'
import WithRootEmit from '../../../event/WithRootEmit.vue'
import { BasicRootEvent } from '../../../event/basicRootEvent'
import Loading from '../../../mixins/Loading.vue'
import currency from '../../../filters/currency'

type IkanChat = Pick<PublicIkan,
  'id'
  | 'gambar'
  | 'name'
  | 'kategori'
  | 'price'
  | 'me'
  | 'permalink_id'
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
    mdbIcon
  },
  filters: {
    currency
  }
})
class ProductDialog extends Mixins(Loading, StoreMix, NavMix, RootEmitMix) {
  @Prop() readonly unsend!: boolean
  @Prop({}) readonly productid!: string
  @Prop({}) readonly shopid!: string
  @Prop({}) readonly selfChat!: boolean

  product: IkanChat = {
    id: '',
    name: '...',
    price: 0,
    kategori: '',
    gambar: [
      'https://developers.google.com/maps/documentation/maps-static/images/error-image-generic.png?hl=id'
    ],
    me: {
      wishlist: false
    },
    permalink_id: ''
  }

  get showAction (): boolean {
    const system = this.tstore.state.system
    return !system.isSeller && !!this.product.id
  }

  get isWish (): boolean {
    return this.product.me?.wishlist || false
  }

  async mounted (): Promise<void> {
    try {
      const product = await publicGetIkan(this.shopid, this.productid)
      this.product = {
        ...this.product,
        ...product
      }
    } catch (e) {
      this.product.name = 'Produk tidak ditemukan'
      errorLog(e)
    }
  }

  toIkan (): void {
    const permaid = this.product.permalink_id
    if (permaid) {
      if (this.tstore.state.system.isSeller) {
        open(`${process.env.VUE_APP_FRONT_URL}/product/${permaid}`)
      } else {
        const params = { permaid }
        this.navigation.push('product_ikan', { params })
      }
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

export default ProductDialog

</script>
