<template>
  <div>
    <div v-if="!isMobile">
      <h5 class="tx-bold p-2 d-flex tx-16" >Chat</h5>
      <div class="d-flex">
        <div class="input-group mx-2">
          <input
            v-model="q"
            class="form-control tx-12 ht-30 rounded-5"
            placeholder="Cari pengguna"
          >
        </div>
      </div>
    </div>
    <div
      id="azChatList"
      class="az-chat-list mt-2 overflow-auto bg-white"
    >
      <ContactList
        v-for="(contact, key) in userlist"
        :key="key"
        :contact="contact"
        @click="contactAction(contact)"
      />
      <InfiniteLoading ref="infiniteLoading" @infinite="infiniteHandler">
        <div slot="spinner"></div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </InfiniteLoading>

      <div v-if="showLoading">
        <ContactLoading v-for="i in 6" :key="i" />
      </div>

      <slot v-if="noResult" name="noresults">
        <NoResults />
      </slot>
    </div>
  </div>
</template>
<style scoped>
  #azChatList {
    position: absolute;
    width: 100%;
    height: calc(100% - 81px) !important;
  }
  #azChatList::-webkit-scrollbar-track
  {
    background-color: #FFF;
  }

  #azChatList::-webkit-scrollbar
  {
    width: 2px;
    background-color: #FFF;
  }

  #azChatList::-webkit-scrollbar-thumb
  {
    background-color: #97a3b9;
  }

  @media (max-width: 768px) {
    #azChatList {
      height: calc(100% - 100px) !important;
    }
  }
</style>
<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import InfiniteLoading, { StateChanger } from 'vue-infinite-loading'

import { UserChat, UserChatBasic } from '../../model/chat'
import VueWithStore from '../../store/wrapper.vue'
import { Namespaced, Store } from '../../store/types'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'
import { ISystemState } from '../../store/system'
import WithNav from '../../navigation/WithNav.vue'
import { BasicRoute } from '../../navigation/basicroute'
import {
  ChatBuyerContact, ChatSellerContact, DocData, initBuyerContacts,
  initSellerContacts, StoreQuery, subscribeContact
} from '../../api/fireChat'
import { IUserState } from '../../store/user'

import ContactList from './contacts/ContactList.vue'
import NoResults from './contacts/NoResults.vue'
import ContactLoading from './contacts/ContactLoading.vue'
import { chatRead } from '../../api/chat'

type State = {
  'chat': IChatState
  'system': ISystemState
  'user': IUserState
}

type ChatStore = Store<State, Namespaced<ChatMutation, 'chat'>, Namespaced<ChatAction, 'chat'>>

@Component
class NavMixins extends WithNav<BasicRoute> {}

@Component
class StoreMixins extends VueWithStore<ChatStore> {}

@Component({
  components: {
    InfiniteLoading,
    ContactList,
    NoResults,
    ContactLoading
  }
})
export default class ChatList extends Mixins(StoreMixins, NavMixins) {
  @Prop() readonly action!: (user: UserChat) => void|Promise<void>

  chatContacts: UserChat[] = []
  subContact: () => void = () => undefined
  loading = false
  endpage = false
  q = ''

  get isMobile (): boolean {
    return this.tstore.state.system.isMobile
  }

  get isSeller (): boolean {
    return this.tstore.state.system.isSeller
  }

  get contactModel (): ChatBuyerContact {
    const { uid, shopid } = this.tstore.state.user
    if (this.isSeller) {
      const csid = uid !== shopid ? uid : ''
      return new ChatSellerContact(shopid, csid)
    }

    return new ChatBuyerContact(uid)
  }

  get initCollection (): StoreQuery<DocData> {
    const { system, user } = this.tstore.state

    if (system.isSeller) {
      const isCs = user.uid !== user.shopid
      const csid = isCs ? user.uid : ''
      return initSellerContacts(user.shopid, csid)
    }

    return initBuyerContacts(user.uid)
  }

  get activeUser (): UserChatBasic {
    return this.tstore.state.chat.userActive
  }

  get showLoading (): boolean {
    return this.userlist.length === 0 && this.loading
  }

  get noResult (): boolean {
    return this.userlist.length === 0 && !this.loading
  }

  get userlist (): UserChat[] {
    const userlist = this.tstore.state.chat.userlist
    const filterByQuery = (user: UserChat): boolean => {
      if (this.q) {
        const searchUser = user.name
          .toLowerCase()
          .search(this.q.toLowerCase())
        return searchUser !== 1
      }

      return true
    }
    const sortByLastChat = (currentUser: UserChat, nextUser: UserChat) => {
      if (currentUser.last_chat < nextUser.last_chat) {
        return 1
      }

      return -1
    }

    return userlist
      .filter(filterByQuery)
      .sort(sortByLastChat)
  }

  mounted (): void {
    this.subContact = subscribeContact(this.initCollection, async (type, contact) => {
      if (contact.id === this.activeUser.id) {
        this.readChat(contact)
      }

      const contactExist = this.userlist
        .find(user => user.id === contact.id)

      if (type === 'added' && !contactExist) {
        const userContact = await this.contactModel.contactUserInfo(contact)
        this.tstore.commit('chat/push_user_list', userContact)
      }

      if (type === 'modified' || contactExist) {
        this.tstore.commit('chat/update_user_list', contact)
      }
    })
  }

  beforeDestroy (): void {
    this.subContact()
  }

  async infiniteHandler ($state: StateChanger): Promise<void> {
    this.loading = true

    if (this.chatContacts.length) {
      const contacts = await this.contactModel.paginateChat()
      this.chatContacts = [...this.chatContacts, ...contacts]
    } else {
      const contacts = await this.contactModel.getContact()
      this.chatContacts = contacts
    }

    this.tstore.commit('chat/set_user_list', this.chatContacts)
    this.loading = false

    if (this.contactModel.haveNext) {
      $state.loaded()
    } else {
      this.endpage = true
      $state.complete()
    }
  }

  async readChat (contact: UserChat): Promise<void> {
    if (contact.unread > 0) {
      await chatRead(contact.id, this.isSeller)
      this.tstore.commit('chat/add_unread', -contact.unread)
    }
  }

  async contactAction (contact: UserChat): Promise<void> {
    const userNotActive = this.activeUser.id !== contact.id
    this.readChat(contact)

    if (userNotActive || this.isMobile) {
      if (this.action) {
        this.action(contact)
      } else {
        this.tstore.commit('chat/clear_order_product')
        await this.tstore.dispatch('chat/openChat', contact)
      }
    }
  }
}

</script>
