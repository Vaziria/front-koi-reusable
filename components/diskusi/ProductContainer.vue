<template>
  <div class="card rounded-10" @click="$emit('click')">
    <!-- loading -->
    <div v-if="loading" class="card-header">
      <div class="d-flex mt-2 bd-5 pl-3 py-2">
        <div class="mr-3">
          <div class="wd-40 wd-md-60 ht-10 ht-md-15 bg-loading-200 mb-2"></div>
          <div class="wd-40 ht-40 wd-md-60 ht-md-60 rounded-5 bg-loading-200"></div>
        </div>
        <div class="align-self-center flex-fill">
          <div class="wd-70p ht-10 ht-md-15 bg-loading-200 mb-1"></div>
          <div class="wd-100 ht-10 ht-md-15 bg-loading-200 mb-1"></div>
          <div class="wd-100 ht-10 ht-md-15 bg-loading-200"></div>
        </div>
      </div>
    </div>

    <!-- product -->
    <div v-else class="card-header">
      <div :class="`d-flex mt-2 bd-l bd-${colorClass} bd-5 pl-3 py-2`">
        <div class="mr-3 align-self-center">

          <span
            v-if="product.id"
            :class="`d-block mb-2 align-self-center badge badge-${colorClass}`"
          >{{ product.status }}</span>
          <span
            v-else
            class="d-block mb-2 align-self-center badge bg-gray-200"
          >tidak ada status</span>

          <img
            :src="product.gambar[0]"
            class="wd-40 ht-40 wd-md-60 wd-ht-60 img-fit-cover rounded-5 bg-gray-200"
          >
        </div>
        <div class="align-self-center flex-fill text-truncate mr-3">
          <h6 class="tx-bold tx-12 tx-md-14 mb-0 text-truncate">{{ product.name }}</h6>
          <p class="tx-orange tx-12 tx-md-14 tx-bold mb-0">{{ product.price | currency }}</p>
          <p class="tx-10 tx-md-12 mb-0">{{ product.kategori }}</p>
          <div v-if="product.tags">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="badge tag tx-bold mr-2"
            >{{ tag }}</span>
          </div>
        </div>
        <div class="align-self-center" @click.prevent.stop>
          <DropdownAction
            :items="dropButtons"
            :dropleft="true"
          >
            <BasicButton
              slot="toggle"
              type="light" class="py-2"
            >
              <i class="fas fa-ellipsis-v"></i>
            </BasicButton>
          </DropdownAction>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<style scoped>
.ht-md-60 {
  height: 60 !important;
}
.ht-40 {
  height: 40 !important;
}
</style>
<script lang="ts">
import { IIkan } from '../../model/ikan'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { publicGetIkan } from '../../api/ikan'
import currency from '../../filters/currency'
import DropdownAction, { IDropdown } from '../../components/dropdown/DropdownAction.vue'
import BasicButton from '../../components/button/BasicButton.vue'

type DiskusiIkan = Pick<IIkan,
  'id'
  | 'name'
  |'gambar'
  | 'price'
  | 'kategori'
  | 'permalink_id'
  | 'tags'
  | 'status'
>

@Component({
  components: {
    DropdownAction,
    BasicButton
  },
  filters: {
    currency
  }
})
class ProductContainer extends Vue {
  @Prop() readonly shopid!: string
  @Prop() readonly ikanid!: string

  loading = true
  product: DiskusiIkan = {
    id: '',
    gambar: [],
    name: '',
    price: 0,
    kategori: '',
    permalink_id: '',
    status: 'ready'
  }

  productStatus: {
    [key in IIkan['status']]: string
  } = {
    ready: 'success',
    booked: 'warning',
    process: 'info',
    sold: 'light',
    arsip: 'dark',
    draft: 'secondary'
  }

  get colorClass (): string {
    if (this.product.id) {
      return this.productStatus[this.product.status]
    }

    return 'gray-200'
  }

  get dropButtons (): IDropdown[] {
    const dropButtons: IDropdown[] = []

    if (this.product.permalink_id) {
      dropButtons.push({
        type: 'action',
        text: 'Lihat ikan',
        action: () => {
          const linkProduct = `${process.env.VUE_APP_FRONT_URL}/product/${this.product.permalink_id}`
          window.open(linkProduct)
        }
      })
    }

    if (!dropButtons.length) {
      dropButtons.push({
        type: 'basic',
        text: 'Tidak ada aksi'
      })
    }

    return dropButtons
  }

  mounted (): void {
    this.getIkan()
  }

  async getIkan (): Promise<void> {
    try {
      const ikan = await publicGetIkan(this.shopid, this.ikanid)
      this.product = ikan
    } catch {
      this.product.name = 'Produk tidak ditemukan'
      this.product.gambar = ['https://developers.google.com/maps/documentation/maps-static/images/error-image-generic.png?hl=id']
    }

    this.loading = false
  }
}

export default ProductContainer
</script>
