<template>
  <ReplyItem
    v-if="product"
    :image="product.gambar"
    :title="product.name"
    :price="product.price"
    @close="removeProduct()"
  />
</template>
<script lang="ts">
import { ChatMutation, IChatState } from '../../../store/chat'
import { Component } from 'vue-property-decorator'
import ReplyItem from './ReplyItem.vue'
import { Namespaced, Store } from '../../../store/types'
import VueWithStore from '../../../store/wrapper.vue'
import { ChatProduct } from '../../../model/chat'

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
class ReplyProduct extends StoreMixins {
  get product (): ChatProduct | null {
    return this.tstore.state.chat.product
  }

  removeProduct (): void {
    this.tstore.commit('chat/set_product', null)
  }
}

export default ReplyProduct
</script>
