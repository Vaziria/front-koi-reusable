<template>
  <div>
    <p class="d-flex tx-left mb-1">
      <span class="flex-fill">Kurir</span>
      <span>{{ shipping.type }}</span>
    </p>
    <p v-if="shipping.kurir_contact" class="d-flex tx-left mb-1">
      <span class="flex-fill">Kontak Kurir</span>
      <span>{{ shipping.kurir_contact }}</span>
    </p>
    <p v-if="shipping.resi" class="d-flex tx-left mb-1">
      <span class="flex-fill">Resi</span>
      <span class="tx-uppercase">{{ shipping.resi }}</span>
    </p>
    <p v-if="shipping.resi_media.length" class="tx-left">Resi Media</p>
    <div v-if="shipping.resi_media.length">
      <a
        v-for="(media, index) in shipping.resi_media"
        :key="index"
        :href="media"
        class="zoom-in"
        target="_blank"
      >
        <img
          :src="media"
          class="wd-300 img-fluid mb-2"
        >
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { IShippingData } from '../../model/shipping'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
class OrderShipping extends Vue {
  @Prop() readonly shipping!: IShippingData
}

export default OrderShipping
</script>
