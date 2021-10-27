<template>
  <div>
    <ProductDialog
      v-if="message.show_product"
      :productid="message.productid"
      :shopid="message.shopid"
      :unsend="isUnsend"
      :self-chat="selfChat"
    />
    <OrderDialog
      v-if="message.show_order"
      :orderid="message.orderid"
      :shopid="message.shopid"
      :unsend="isUnsend"
      :self-chat="selfChat"
    />
    <div class="d-block mb-1">
      <div :class="{
        'd-flex': true,
        'justify-content-end': selfChat
      }">
        <TextDialog
          :text="message.text"
          :unsend="message.send_process"
          :date="message.created"
          :error="message.send_error"
          class="mb-0"
          @click="resendChat()"
        />
      </div>
      <div
        v-if="message.send_error"
        :class="{
          'd-flex tx-info tx-10': true,
          'justify-content-end': selfChat
        }"
      >
        <span>klik untuk mengirim ulang</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ChatUI } from '../../../model/chat'
import { Component, Prop, Emit } from 'vue-property-decorator'
import ProductDialog from './ProductDialog.vue'
import OrderDialog from './OrderDialog.vue'
import TextDialog from './TextDialog.vue'
import { IChatState, ChatAction } from '../../../store/chat'
import { Namespaced, Store } from '../../../store/types'
import VueWithStore from '../../../store/wrapper.vue'

type State = {
  'chat': IChatState
}
// eslint-disable-next-line @typescript-eslint/ban-types
type ChatStore = Store<State, {}, Namespaced<ChatAction, 'chat'>>

@Component
class StoreMixins extends VueWithStore<ChatStore> {}

@Component({
  components: {
    ProductDialog,
    OrderDialog,
    TextDialog
  }
})
class ChatDialog extends StoreMixins {
  @Prop() readonly message!: ChatUI

  get isUnsend (): boolean {
    return !!this.message.send_process || !!this.message.send_error
  }

  get selfChat (): boolean {
    const targetId = this.tstore.state.chat.userActive.id
    return this.message.from_id !== targetId
  }

  @Emit('onResend')
  resendChat (): void {
    if (this.message.send_error) {
      // eslint-disable-next-line camelcase
      const { id, from_id, text, to_id } = this.message
      const created = new Date().getTime()

      this.tstore.dispatch('chat/sendChat', {
        id,
        created,
        from_id,
        text,
        to_id
      })
    }
  }
}

export default ChatDialog

</script>
