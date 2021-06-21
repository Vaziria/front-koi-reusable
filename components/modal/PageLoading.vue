<template>
  <mdb-modal :show="show" centered class="effect-just-me show" style="z-index: 2001">
    <mdb-modal-body class=tx-center>
      <div class="spinner-border text-info" role=status />
      <h5 class=mt-4>{{ loadingText }}</h5>
    </mdb-modal-body>
  </mdb-modal>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mdbModal, mdbModalBody } from 'mdbvue'
import WithRootEmit from '../../event/WithRootEmit.vue'
import { BasicRootEvent } from '../../event/basicRootEvent'
import store from '@/store'

class RootEmitMix extends WithRootEmit<BasicRootEvent> {}

@Component({
  components: {
    mdbModal,
    mdbModalBody
  }
})
export default class PageLoad extends RootEmitMix {
  get show (): boolean {
    return store.state.loading.show
  }

  get loadingText (): string {
    return store.state.loading.text || 'Loading'
  }

  mounted (): void {
    this.rootOn<'pageloading'>('pageloading', (payload) => {
      store.commit('loading/set_loading', payload.show)
      store.commit('loading/set_text', payload.text)
    })
  }
}
</script>
