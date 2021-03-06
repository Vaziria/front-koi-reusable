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
          <div class="spinner-border spinner-grow-sms text-info d-block mg-x-auto mt-3"></div>
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
            @onResend="scrollchat()"
          />
      </MessageGroup>

      <NoResults v-if="noResult" slot="noresult" />
    </MessageContainer>

    <ReplyProduct />
    <ReplyOrder />

    <ChatForm @onChat="scrollchat()" />
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator'
import InfiniteLoading, { StateChanger } from 'vue-infinite-loading'

import ChatHeader from './ChatHeader.vue'
import ChatForm from './ChatForm.vue'

import MessageContainer from './messages/MessageContainer.vue'
import MessageGroup from './messages/MessageGroup.vue'

import ChatDialog from './dialog/ChatDialog.vue'

import ReplyProduct from './reply/ReplyProduct.vue'
import ReplyOrder from './reply/ReplyOrder.vue'

import { Chat, ChatUI, UserChat } from '../../model/chat'
import VueWithStore from '../../store/wrapper.vue'
import { Namespaced, Store } from '../../store/types'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'
import { IUserState } from '../../store/user'
import { ISystemState } from '../../store/system'
import WithNav from '../../navigation/WithNav.vue'
import { BasicRoute } from '../../navigation/basicroute'
import NoResults from '../../components/noresults/Chat.vue'
import { ChatMessages, subscribeChat, FireChatPayload } from '../../api/fireChat'
import { chatRead } from '../../api/chat'

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
    ChatHeader,
    MessageContainer,
    MessageGroup,
    ReplyProduct,
    ReplyOrder,
    ChatDialog,
    ChatForm,
    NoResults
  }
})
export default class ChatBox extends Mixins(StoreMixins, NavMixins) {
  @Prop() readonly noClose!: boolean

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

  get user (): UserChat {
    return this.tstore.state.chat.userActive
  }

  get unsendMessages (): ChatUI[] {
    return this.tstore.state.chat.unsend
      .filter(chat => chat.to_id === this.user.id)
      .map(chat => {
        return {
          ...chat,
          send_process: true
        }
      })
  }

  get errorMessages (): ChatUI[] {
    return this.tstore.state.chat.errorchat
      .filter(chat => chat.to_id === this.user.id)
      .map(chat => {
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
      ...this.unsendMessages,
      ...this.errorMessages,
      ...this.messages
    ]
    const fixmsgs = msgs
      .filter(chat => chat)
      .sort((currentMsg, nextMsg) => {
        return currentMsg.created > nextMsg.created ? -1 : 1
      })
      .map((chat: ChatUI) => {
        const notProcessOrError = !chat.send_process && !chat.send_error

        if (chat.productid && notProcessOrError) {
          if (!productids.includes(chat.productid)) {
            productids.push(chat.productid)
            chat.show_product = true
          }
        }

        if (chat.orderid && notProcessOrError) {
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
    if (!this.isMobile) {
      this.subChat()
      this.initChat()

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
      } else {
        const messages = await this.chatMessages.getChat()
        this.messages = [...messages]
        this.scrollchat()
      }

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
    const { chat, system } = this.tstore.state
    chatRead(chat.userActive.id, system.isSeller)
    this.tstore.commit('chat/reset_user')
    this.tstore.commit('chat/reset_message_unsend_error')
    this.subChat()
  }

  initChat (): void {
    this.chatMessages = new ChatMessages(this.payload)
    this.subChat = subscribeChat(this.payload, (msg) => {
      this.messages = [msg, ...this.messages]
    })
  }

  scrollchat (): void {
    setTimeout(() => {
      const chatBody = this.$el.children[1].children[0]
      chatBody.scrollTo({ top: chatBody.scrollHeight })
    }, 300)
  }

  close (): void {
    this.tstore.commit('chat/mini_show', false)
  }
}
</script>
