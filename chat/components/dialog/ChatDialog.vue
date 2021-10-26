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
    <div class="d-block">
      <div :class="{
        'd-flex': true,
        'justify-content-end': selfChat
      }">
        <TextDialog
          :text="message.text"
          :unsend="isUnsend"
          :date="message.created"
          :error="message.send_error"
        />
      </div>
    </div>
  </div>
  <!-- <div :class="{ 'az-msg-wrapper rounded-5 p-2': true, 'op-5': message.send_process }">
    <ProductChat v-if="message.show_product" :productid="message.productid" :shopid="message.shopid"/>
    <OrderChat v-if="message.show_order" :orderid="message.orderid" :shopid="message.shopid" />
    <div class="d-flex tx-12">
      <span class="wrap mr-2">{{ message.text }}</span>
      <small class="d-block tx-right ml-auto align-self-end op-5">
        <br>
        <span>{{ parseInt(message.created) | moment('HH:mm:ss') }}</span>
        <a href="#"><i class="icon ion-android-more-horizontal"></i></a>
        <i v-if="message.error" class="fas fa-exclamation-triangle" />
      </small>
    </div>
  </div> -->
</template>
<script lang="ts">
import { ChatUI } from '../../../model/chat'
import { Component, Prop } from 'vue-property-decorator'
import ProductDialog from './ProductDialog.vue'
import OrderDialog from './OrderDialog.vue'
import TextDialog from './TextDialog.vue'
import { IChatState } from '../../../store/chat'
import { Store } from '../../../store/types'
import VueWithStore from '../../../store/wrapper.vue'

type State = {
  'chat': IChatState
}
// eslint-disable-next-line @typescript-eslint/ban-types
type ChatStore = Store<State, {}, {}>

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
}

export default ChatDialog

</script>
