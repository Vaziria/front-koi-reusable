<template>
  <div class="p-2 tx-center">
     <mdb-icon far icon="comments tx-gray-400 pos-relative" size=3x />
    <p class="tx-12 tx-gray-400">tidak ada kontak ditemukan</p>
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
class NoResults extends Vue {}

export default NoResults
</script>
