<template>
  <div class="">
    <ChatHeader :no-close="noClose" />
    <div
      id="azChatBody"
      :class="bodyClass"
    >
      <InfiniteLoading
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

      <div
        v-for="groupDate in messagesGroupDate"
        :key="groupDate.dateKey"
        :id="groupDate.dateString"
      >
        <div class="tx-center mb-4 mt-3 pt-2">
          <span
            class="badge badge-dark tx-11 p-2 rounded-10 op-9 tx-gray-200"
          >{{ groupDate.dateString }}</span>
        </div>

        <div
          v-for="(usermsg, index) in groupDate.messages"
          :key="index"
          :class="{
            media: true,
            'flex-row-reverse': usermsg.key !== user.id
          }"
        >
          <div class="media-body mx-2">
            <ChatDialog
              v-for="message in usermsg.data"
              :key="message.id"
              :message="message"
            />
          </div>
        </div>
      </div>

      <NoResults v-if="noResult" />

    </div>
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
// import ChartPop from '../../../components/Chart/ChartPop.vue'
import { Chat, ChatOrder, ChatProduct, UserChat } from '../../model/chat'
import VueWithStore from '../../store/wrapper.vue'
import { Namespaced, Store } from '../../store/types'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'
import { IUserState } from '../../store/user'
import { ISystemState } from '../../store/system'
import WithNav from '../../navigation/WithNav.vue'
import { BasicRoute } from '../../navigation/basicroute'
import NoResults from '../../components/noresults/Chat.vue'
import dateFormater from '../../filters/date'
import { ChatMessages, initBuyerChat, FireChatPayload } from '../../api/fireChat'

interface ChatUi extends Chat {
  'show_product'?: boolean
  'show_order'?: boolean
}

interface TransformChat {
  key: string,
  data: ChatUi[]
}

type UnformatGroupByDateMessages = {
  dateString: string
  dateKey: string
  messages: ChatUi[]
}

type GroupByDateMessages = {
  dateString: string
  dateKey: string
  messages: TransformChat[]
}

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
    ChatDialog,
    ChatReply,
    ChatForm,
    NoResults
    // ChartPop
  }
})
export default class ChatBox extends Mixins(StoreMixins, NavMixins) {
  @Prop() readonly noClose!: boolean

  endpage = false
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
      this.endpage
  }

  get bodyClass (): string {
    let defaultClass = 'az-chat-body content-inner py-3'

    if (!this.tstore.state.system.isMobile) {
      defaultClass += ' mg-t-60 mg-md-t-0'
    }

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

  get unsendMessages (): ChatUi[] {
    return this.tstore.state.chat.unsend.map(chat => {
      return {
        ...chat,
        send_process: true
      }
    })
  }

  get errorMessages (): ChatUi[] {
    return this.tstore.state.chat.errorchat.map(chat => {
      return {
        ...chat,
        send_error: true
      }
    })
  }

  get messagesUi (): ChatUi[] {
    const orderids: string[] = []
    const productids: string[] = []
    const msgs = [
      ...this.messages,
      ...this.unsendMessages,
      ...this.errorMessages
    ]
    const fixmsgs = msgs
      .filter(chat => chat)
      .map((chat: ChatUi) => {
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

  get messagesGroupDate (): GroupByDateMessages[] {
    const defaultGroups: UnformatGroupByDateMessages[] = []
    const messagesGroupDate = this.messagesUi.reduce((results, message) => {
      const dateString = dateFormater(message.created, 'DD MN YY')
      const dateKey = dateFormater(message.created, 'YYMMDD')

      const findResultDate = results.find(dateGroup => {
        return dateGroup.dateKey === dateKey
      })

      if (findResultDate) {
        findResultDate.messages.push(message)
        results = results.map(messageData => {
          if (messageData.dateKey === dateKey) {
            return findResultDate
          }
          return messageData
        })
      } else {
        results.push({
          dateString,
          dateKey,
          messages: [message]
        })
      }

      return results
    }, defaultGroups)

    return messagesGroupDate
      .map(groupDate => {
        const { dateString, dateKey, messages } = groupDate
        return {
          dateString,
          dateKey,
          messages: this.transformChat(messages)
        }
      })
      .sort((curgroupDate, nextgroupDate) => {
        return (curgroupDate.dateKey > nextgroupDate.dateKey ? 1 : -1)
      })
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
      } else {
        const messages = await this.chatMessages.getChat()
        this.messages = messages
        setTimeout(() => this.scrollchat(), 300)
      }

      if (this.chatMessages.haveNext) {
        $state.loaded()
      } else {
        $state.complete()
        this.endpage = true
      }
    }
  }

  async mounted (): Promise<void> {
    this.initChat()
    this.scrollchat()
    this.$el.children[1].addEventListener('scroll', this.handleScroll)
  }

  beforeDestroy (): void {
    this.subChat()
    this.$el.children[1].removeEventListener('scroll', this.handleScroll)
  }

  initChat (): void {
    this.chatMessages = new ChatMessages(this.payload)
    this.subChat = initBuyerChat(this.payload, (msg) => {
      this.messages = [...this.messages, msg]
    })
  }

  handleScroll (elem: Event): void {
    const { children, scrollTop } = elem.target as HTMLDivElement
    const getCurrentDate = [...children]
      .find((child) => {
        const offset = [(child as HTMLDivElement).offsetTop]

        if (child.nextElementSibling) {
          offset[1] = (child.nextElementSibling as HTMLDivElement).offsetTop
        }

        if (scrollTop >= offset[0]) {
          if (offset[1]) {
            return scrollTop <= offset[1]
          }
          return true
        }
      })

    this.currentDate = getCurrentDate?.id || ''

    window.setTimeout(() => {
      this.currentDate = ''
    }, 3000)
  }

  scrollchat (): void {
    const chatBody = this.$el.children[1]
    chatBody.scrollTo({ top: chatBody.scrollHeight })
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
