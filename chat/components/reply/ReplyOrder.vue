<template>
  <ReplyItem
    v-if="order"
    :image="image"
    :title="order.id"
    :price="order.total"
    @close="removeOrder()"
  />
</template>
<script lang="ts">
import { ChatMutation, IChatState } from '../../../store/chat'
import { Component } from 'vue-property-decorator'
import ReplyItem from './ReplyItem.vue'
import { Namespaced, Store } from '../../../store/types'
import VueWithStore from '../../../store/wrapper.vue'
import { ChatOrder } from '../../../model/chat'

type State = {
  'chat': IChatState
}

// eslint-disable-next-line @typescript-eslint/ban-types
type ChatStore = Store<State, Namespaced<ChatMutation, 'chat'>, {}>

@Component
class StoreMixins extends VueWithStore<ChatStore> {}

@Component({
  components: {
    ReplyItem
  }
})
class ReplyOrder extends StoreMixins {
  get order (): ChatOrder | null {
    return this.tstore.state.chat.order
  }

  get image (): string {
    if (this.order) {
      return this.order
        .ikans[0]
        .gambar[0]
    }

    return ''
  }

  removeOrder (): void {
    this.tstore.commit('chat/set_order', null)
  }
}

export default ReplyOrder
</script>
