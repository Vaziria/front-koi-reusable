<template>
  <div :class="{ 'az-msg-wrapper rounded-5 p-2': true, 'op-5': message.send_process }">
    <ProductChat v-if="message.show_product" :productid="message.productid" :shopid="message.shopid"/>
    <OrderChat v-if="message.show_order" :orderid="message.orderid" :shopid="message.shopid" />
    <div class="d-flex">
      <span class="wrap mr-2">{{ message.text }}</span>
      <small class="d-block tx-right ml-auto align-self-end op-5">
        <span>{{ parseInt(message.created) | moment('LT') }}</span>
        <a href="#"><i class="icon ion-android-more-horizontal"></i></a>
        <i v-if="message.error" class="fas fa-exclamation-triangle" />
      </small>
    </div>
  </div>
</template>
<script lang="ts">
import { Chat } from '../../model/chat'
import { Vue, Component, Prop } from 'vue-property-decorator'
import ProductChat from './productChat.vue'
import OrderChat from './orderChat.vue'
import moment from '../../filters/moment'

interface ChatUi extends Chat {
  'show_product'?: boolean
  'show_order'?: boolean
}

@Component({
  components: {
    ProductChat,
    OrderChat
  },
  filters: {
    moment
  }
})
class ChatDialog extends Vue {
  @Prop() readonly message!: ChatUi
}

export default ChatDialog

</script>
