<template>
  <div class="">
    <ChatHeader />

    <div
      id="azChatBody"
      :class="bodyClass"
    >
      <InfiniteLoading
        ref="infiniteLoading"
        direction="top"
        @infinite="infiniteHandler"
      >
        <div slot="spinner"><ChatLoading /></div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </InfiniteLoading>

      <div v-for="(msg, key) in messages" :key="key" :class="{ media: true, 'flex-row-reverse': msg.key !== user.id }">
        <div class="media-body">
          <ChatDialog
            v-for="message in msg.data"
            :key="message.id"
            :message="message"
          />
        </div>
      </div>

    </div>
    <ChatReply
      v-if="product"
      :image="product.gambar[0]"
      :text="product.name"
      :action="removeProduct"
    />
    <ChatReply
      v-if="order"
      :image="order.ikans[0].gambar[0]"
      :text="order.id"
      :action="removeOrder"
    />
    <ChatForm @onChat="scrollchat()" />
  </div>
</template>
<style scoped>
  #azChatBody {
    position: absolute;
    width: 100%;
    height: calc(100% - 103px) !important;
    overflow: auto;
  }
  #azChatBody.with-reply {
    height: calc(100% - 177px) !important;
  }
  #azChatBody::-webkit-scrollbar-track
  {
    background-color: #FFF;
  }

  #azChatBody::-webkit-scrollbar
  {
    width: 2px;
    background-color: #FFF;
  }

  #azChatBody::-webkit-scrollbar-thumb
  {
    background-color: #97a3b9;
  }
</style>
<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import $ from 'jquery'
import InfiniteLoading from 'vue-infinite-loading'

import ChatLoading from './ChatLoading.vue'
import ChatHeader from './ChatHeader.vue'
import ChatDialog from './ChatDialog.vue'
import ChatReply from './ChatReply.vue'
import ChatForm from './ChatForm.vue'
import { Chat, ChatOrder, ChatProduct, UserChat } from '../../model/chat'
import { VueWithStore } from '../../store/wrapper.vue'
import { Namespaced, Store } from '../../store/types'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'

interface ChatUi extends Chat {
  'show_product'?: boolean
  'show_order'?: boolean
}

interface TransformChat {
  key: string,
  data: ChatUi[]
}

type State = {
    'chat': IChatState
}

type ChatStore = Store<State, Namespaced<ChatMutation, 'chat'>, Namespaced<ChatAction, 'chat'>>

@Component({
  components: {
    InfiniteLoading,
    ChatLoading,
    ChatHeader,
    ChatDialog,
    ChatReply,
    ChatForm
  }
})
export default class ChatBox extends VueWithStore<ChatStore> {
  get loading (): boolean {
    return this.tstore.state.chat.loading
  }

  get bodyClass (): string {
    let defaultClass = 'az-chat-body content-inner py-3 mg-t-60 mg-md-t-0'

    if (this.product || this.order) {
      defaultClass += ' with-reply'
    }

    return defaultClass
  }

  // getter product dan order chat dari store
  get product (): ChatProduct | null {
    return this.tstore.state.chat.product
  }

  get user (): UserChat {
    return this.tstore.state.chat.userActive
  }

  get order (): ChatOrder | null {
    return this.tstore.state.chat.order
  }

  get messages (): TransformChat[] {
    const orderids: string[] = []
    const productids: string[] = []

    const unsend = this.tstore.state.chat.unsend.map(chat => {
      return { ...chat, send_process: true }
    })
    const error = this.tstore.state.chat.errorchat.map(chat => {
      return { ...chat, send_error: true }
    })
    const msgs = [...this.tstore.state.chat.message, ...error, ...unsend]
    const fixmsgs = msgs.map((chat: ChatUi) => {
      if (chat.productid) {
        if (!productids.includes(chat.productid)) {
          productids.push(chat.productid)
          chat.show_product = true
        }
      }

      if (chat.orderid) {
        if (!orderids.includes(chat.orderid)) {
          orderids.push(chat.orderid)
          chat.show_order = true
        }
      }
      return chat
    })

    const data = this.transformChat(fixmsgs)
    return data
  }

  @Watch('user')
  async updateUser (): Promise<void> {
    await this.tstore.dispatch('chat/getMessage')
    this.scrollchat()
  }

  async mounted (): Promise<void> {
    this.tstore.commit('chat/set_chat_ref', (this.$refs.infiniteLoading as InfiniteLoading).stateChanger)
    await this.tstore.dispatch('chat/getMessage')
    this.scrollchat()
  }

  async infiniteHandler (): Promise<void> {
    if (this.tstore.state.chat.message.length) {
      await this.tstore.dispatch('chat/paginate')
    }
  }

  scrollchat (): void {
    setTimeout(() => { $('#azChatBody').scrollTop($('#azChatBody').prop('scrollHeight')) }, 100)
  }

  close (): void {
    this.tstore.commit('chat/mini_show', false)
  }

  transformChat (messages: Chat[]): TransformChat[] {
    // getting pesan
    let id: string
    const hasil: TransformChat[] = []

    messages.forEach(d => {
      id !== d.from_id && hasil.push({ key: d.from_id, data: [] })
      id !== d.from_id && (id = d.from_id)

      hasil[hasil.length - 1].data.push(d)
    })
    return hasil
  }

  removeOrder (): void {
    this.tstore.commit('chat/set_order', null)
  }

  removeProduct (): void {
    this.tstore.commit('chat/set_product', null)
  }
}
</script>
