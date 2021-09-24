<template>
  <div class="tx-center">
    <div class="tx-center pt-5">
      <div class="pos-relative wd-200 mx-auto">
        <mdb-icon icon="clipboard-check tx-info pos-relative" size=9x style="z-index: 2" /><br>
        <mdb-icon far icon="clipboard tx-gray-200 pos-absolute b-20 r-0" size=5x style="z-index: 1" />
        <mdb-icon far icon="clipboard tx-gray-200 pos-absolute b-20 l-0" size=5x style="z-index: 1" />
      </div>
      <br>
      <h6 class="tx-bold tx-gray-800">Testimoni Kosong</h6>
      <p class="tx-12 tx-gray-500">tidak ada testimoni yang berhasil ditemukan</p>

      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mdbIcon } from 'mdbvue'

@Component({
  components: {
    mdbIcon
  }
})
class NoResultsTestimoni extends Vue {
}

export default NoResultsTestimoni
</script>
