<template>
  <div class="wd-100p tx-12">
    <p class="text-capitalize">
      <b>{{ address.buyer_name }}</b>
      <br>{{ address.alamat }}
      <br>{{ address.phone_number }}
      <br>{{ addressLocation }}
    </p>
  </div>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Address } from '../../model/order'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
class AddressText extends Vue {
  @Prop() readonly address!: Address

  get addressLocation (): string {
    const { province, region, district, postal_code } = this.address
    const allLoc = [district, region, province, postal_code]
    return allLoc.join(', ').toLowerCase()
  }
}

export default AddressText
</script>
