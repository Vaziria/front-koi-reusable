<template>
  <div class="tx-center">
    <div class="tx-center pt-5">
      <div class="pos-relative wd-200 mx-auto">
        <mdb-icon icon="bell tx-info pos-relative" size=7x style="z-index: 2" /><br>
        <mdb-icon icon="border-none tx-gray-200 pos-absolute b-20 r-0" size=4x style="z-index: 1" />
        <mdb-icon icon="border-none tx-gray-200 pos-absolute b-20 l-0" size=4x style="z-index: 1" />
      </div>
      <br>
      <h6 class="tx-bold tx-gray-800">{{ title }}</h6>
      <p class="tx-12 tx-gray-500">{{ subtitle }}</p>

      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdbIcon } from 'mdbvue'

const defTitle = 'Notifikasi Anda kosong'
const defSubtitle = 'tidak ada notifikasi yang berhasil ditemukan'

@Component({
  components: {
    mdbIcon
  }
})
class NoResultsNotif extends Vue {
  @Prop({ default: defTitle }) readonly title!: string
  @Prop({ default: defSubtitle }) readonly subtitle!: string
}

export default NoResultsNotif
</script>
