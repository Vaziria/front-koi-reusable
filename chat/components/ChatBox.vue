<template>
  <div class="">
    <ChatHeader :no-close="noClose" />

    <MessageContainer :messages="messagesUi">
      <InfiniteLoading
        slot="infinite"
        ref="infiniteLoading"
        direction="top"
        @infinite="infiniteHandler"
      >
        <div slot="spinner">
          <div class="spinner-border spinner-grow-sms text-info d-block mg-x-auto"></div>
          <p class="tx-12 tx-center">Memuat pesan...</p>
        </div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </InfiniteLoading>

      <MessageGroup
        slot-scope="data"
        :messages="data.messages"
      >
          <ChatDialog
            slot-scope="data"
            :message="data.message"
          />
      </MessageGroup>

      <NoResults v-if="noResult" slot="noresult" />
    </MessageContainer>

    <ChatReply
      v-if="product"
      :image="product.gambar"
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
    <!-- <chart-pop v-if="isMobile" /> -->

    <div
      v-if="currentDate"
      class="tx-center mb-4 mt-3 pt-2 pos-absolute t-40 z-index-200 tx-center wd-100p"
    >
      <span
        class="badge badge-dark tx-11 p-2 rounded-10 op-9 tx-gray-200"
      >{{ currentDate }}</span>
    </div>
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
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator'
import InfiniteLoading, { StateChanger } from 'vue-infinite-loading'

import ChatLoading from './ChatLoading.vue'
import ChatHeader from './ChatHeader.vue'
import ChatDialog from './ChatDialog.vue'
import ChatReply from './ChatReply.vue'
import ChatForm from './ChatForm.vue'

import MessageContainer from './messages/MessageContainer.vue'
import MessageGroup from './messages/MessageGroup.vue'

// import ChartPop from '../../../components/Chart/ChartPop.vue'
import { Chat, ChatOrder, ChatProduct, ChatUI, UserChat } from '../../model/chat'
import VueWithStore from '../../store/wrapper.vue'
import { Namespaced, Store } from '../../store/types'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'
import { IUserState } from '../../store/user'
import { ISystemState } from '../../store/system'
import WithNav from '../../navigation/WithNav.vue'
import { BasicRoute } from '../../navigation/basicroute'
import NoResults from '../../components/noresults/Chat.vue'
import { ChatMessages, subscribeChat, FireChatPayload } from '../../api/fireChat'

type State = {
  'chat': IChatState
  'system': ISystemState
  'user': IUserState
}

type ChatStore = Store<State,
  Namespaced<ChatMutation, 'chat'>,
  Namespaced<ChatAction, 'chat'>
>

@Component
class StoreMixins extends VueWithStore<ChatStore> {}

@Component
class NavMixins extends WithNav<BasicRoute> {}

@Component({
  components: {
    InfiniteLoading,
    ChatLoading,
    ChatHeader,
    MessageContainer,
    MessageGroup,
    ChatDialog,
    ChatReply,
    ChatForm,
    NoResults
    // ChartPop
  }
})
export default class ChatBox extends Mixins(StoreMixins, NavMixins) {
  @Prop() readonly noClose!: boolean

  currentDate = ''
  messages: Chat[] = []

  chatMessages: ChatMessages | null = null
  subChat: () => void = () => undefined

  get payload (): FireChatPayload {
    if (this.isSeller) {
      let csid
      const { uid, shopid } = this.tstore.state.user

      if (uid !== shopid) {
        csid = uid
      }

      return {
        sellerid: shopid,
        userid: this.user.id,
        csid
      }
    }

    return {
      sellerid: this.user.id,
      userid: this.tstore.state.user.uid
    }
  }

  get isMobile (): boolean {
    return this.tstore.state.system.isMobile
  }

  get isSeller (): boolean {
    return this.tstore.state.system.isSeller
  }

  get noResult (): boolean {
    const { unsend, errorchat } = this.tstore.state.chat
    return this.messages.length === 0 &&
      unsend.length === 0 &&
      errorchat.length === 0 &&
      !this.chatMessages?.haveNext
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

  get unsendMessages (): ChatUI[] {
    return this.tstore.state.chat.unsend.map(chat => {
      return {
        ...chat,
        send_process: true
      }
    })
  }

  get errorMessages (): ChatUI[] {
    return this.tstore.state.chat.errorchat.map(chat => {
      return {
        ...chat,
        send_error: true
      }
    })
  }

  get messagesUi (): ChatUI[] {
    const orderids: string[] = []
    const productids: string[] = []
    const msgs = [
      ...this.messages,
      ...this.unsendMessages,
      ...this.errorMessages
    ]
    const fixmsgs = msgs
      .filter(chat => chat)
      .map((chat: ChatUI) => {
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

    return fixmsgs
  }

  @Watch('user')
  async updateUser (): Promise<void> {
    this.subChat()
    this.initChat()
    if (!this.isMobile) {
      const infiniteLoading = this.$refs.infiniteLoading as InfiniteLoading
      if (infiniteLoading) {
        this.messages = []
        infiniteLoading.stateChanger.reset()
      }
    }
  }

  async infiniteHandler ($state: StateChanger): Promise<void> {
    if (this.chatMessages) {
      if (this.messages.length) {
        const messages = await this.chatMessages.paginateChat()
        this.messages = [...this.messages, ...messages]
        console.log([...this.messages, ...messages], messages)
      } else {
        const messages = await this.chatMessages.getChat()
        this.messages = [...messages]
        setTimeout(() => this.scrollchat(), 300)
      }

      console.log(this.messages.length)

      if (this.chatMessages.haveNext) {
        setTimeout(() => $state.loaded(), 300)
      } else {
        $state.complete()
      }
    }
  }

  async mounted (): Promise<void> {
    this.initChat()
    this.scrollchat()
  }

  beforeDestroy (): void {
    this.subChat()
  }

  initChat (): void {
    this.chatMessages = new ChatMessages(this.payload)
    this.subChat = subscribeChat(this.payload, (msg) => {
      this.messages = [...this.messages, msg]
    })
  }

  scrollchat (): void {
    const chatBody = this.$el.children[1]
    chatBody.scrollTo({ top: chatBody.scrollHeight })
  }

  close (): void {
    this.tstore.commit('chat/mini_show', false)
  }

  removeOrder (): void {
    this.tstore.commit('chat/set_order', null)
  }

  removeProduct (): void {
    this.tstore.commit('chat/set_product', null)
  }
}
</script>
