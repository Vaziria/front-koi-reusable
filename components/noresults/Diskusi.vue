<template>
  <div class="tx-center">
    <div class="tx-center pt-5">
      <div class="pos-relative wd-200 mx-auto pd-t-35">
        <mdb-icon icon="user-friends tx-info pos-relative" size=5x style="z-index: 2" /><br>
        <mdb-icon icon="comment-alt tx-gray-200 pos-absolute t-0 r-0" size=5x style="z-index: 1" />
        <mdb-icon icon="braille tx-gray-200 pos-absolute t-0 l-0" size=5x style="z-index: 1" />
      </div>
      <br>
      <h6 class="tx-bold tx-gray-800">{{ title }}</h6>
      <p class="tx-12 tx-gray-500">{{ subtitle }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdbIcon } from 'mdbvue'

const defTitle = 'Diskusi Kosong'
const defSubtitle = 'tidak ada diskusi yang berhasil ditemukan'

@Component({
  components: {
    mdbIcon
  }
})
class NoResultsProduct extends Vue {
  @Prop({ default: 'parachute-box' }) readonly mainIcon!: string
  @Prop({ default: defTitle }) readonly title!: string
  @Prop({ default: defSubtitle }) readonly subtitle!: string
}

export default NoResultsProduct
</script>
