<template>
  <mdb-modal :show="show" centered class="effect-just-me show" style="z-index: 2001">
    <mdb-modal-body class=tx-center>
      <div class="spinner-border text-info" role=status />
      <h5 class=mt-4>{{ loadingText }}</h5>
    </mdb-modal-body>
  </mdb-modal>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { mdbModal, mdbModalBody } from 'mdbvue'
import WithRootEmit from '../../event/WithRootEmit.vue'
import { BasicRootEvent } from '../../event/basicRootEvent'
import { ILoadingState, LoadingMutation, LoadingAction } from '../../store/loading'
import { Store, Namespaced } from '../../store/types'
import WithStore from '../../store/wrapper.vue'

class RootEmitMix extends WithRootEmit<BasicRootEvent> {}

type State = {
  'loading': ILoadingState
}

type LoadingStore = Store<State, Namespaced<LoadingMutation, 'loading'>, Namespaced<LoadingAction, 'loading'>>
class RootWithStore extends WithStore<LoadingStore> {}

@Component({
  components: {
    mdbModal,
    mdbModalBody
  }
})
export default class PageLoad extends Mixins(RootEmitMix, RootWithStore) {
  get show (): boolean {
    return this.tstore.state.loading.show
  }

  get loadingText (): string {
    return this.tstore.state.loading.text || 'Loading'
  }

  mounted (): void {
    this.rootOn<'pageloading'>('pageloading', (payload) => {
      this.tstore.commit('loading/set_loading', payload.show)
      this.tstore.commit('loading/set_text', payload.text)
    })
  }
}
</script>
