<template>
  <div>
    <h5
      v-if="!isMobile"
      class="tx-bold p-2 d-flex tx-16"
    >Chat</h5>
    <div class="d-flex">
      <div
        v-if="!isMobile"
        class="input-group mx-2"
      >
        <input
          v-model="q"
          class="form-control tx-12 ht-30 rounded-5"
          placeholder="Cari pengguna"
        >
      </div>
    </div>
    <div
      id="azChatList"
      class="az-chat-list mt-2 overflow-auto bg-white"
    >
      <div
        v-for="(chat, key) in userlist"
        :key="key"
        :class="{
          'media new py-2': true,
          selected: !isMobile && user.id === chat.id
        }"
        @click="contactAction(chat)"
      >
        <div :class="`wd-30 ht-30 az-img-user ${ chat.state }`">
          <img :src="chat.photoUrl || chat.profile_image || defaultImg" alt="">
          <span v-if="chat.unread">{{ chat.unread }}</span>
        </div>
        <div class="media-body ellipsis">
          <div class="media-contact-name mb-0">
            <div class="tx-12 wd-80 ellipsis">
              {{ chat.name || chat.displayName || chat.seller_name }}
            </div>
            <span class="d-md-none">
              {{ parseInt(chat.last_msg.created) | fromNow }}
            </span>
          </div>
          <div
            v-if="isBuyer"
            class="badge badge-info"
          >Penjual</div>
          <div
            v-else-if="chat.last_msg.created"
            class="tx-gray-500 tx-12 ellipsis"
          >{{ chat.last_msg.text }}</div>
        </div>
      </div>
      <InfiniteLoading ref="infiniteLoading" @infinite="infiniteHandler">
        <div slot="spinner"></div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </InfiniteLoading>

      <div v-if="showLoading">
        <div v-for="i in 6" :key="i" class="d-flex my-3">
          <div class="mx-3">
            <div class="wd-35 ht-35 bg-loading rounded-circle"></div>
          </div>
          <div class="wd-100p mr-3">
            <div class="wd-100p ht-15 bg-loading mb-1"></div>
            <div class="wd-100p ht-10 bg-loading mb-2"></div>
          </div>
        </div>
      </div>

      <slot
        v-if="noResult"
        name="noresults"
      >
        <div class="p-2 tx-center">
           <mdb-icon far icon="comments tx-gray-400 pos-relative" size=3x />
          <p class="tx-12 tx-gray-400">tidak ada kontak ditemukan</p>
        </div>
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
  .form-control::placeholder {
    font-size: 12px;
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
<style>
  .chatlist div div .vs__selected {
    color:  rgba(0,0,0,.4);
    border-radius: 5px !important;
    height: 20px;
    width: 50px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    z-index: 50;
  }
  .chatlist, .chatlist .vs__dropdown-toggle {
    border: 0;
    height: 30px;
    border-radius: 5px !important;
  }
</style>
<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import InfiniteLoading, { StateChanger } from 'vue-infinite-loading'

import { mdbIcon } from 'mdbvue'
import { fromNow } from '../../filters/moment'

import { UserChat } from '../../model/chat'
import VueWithStore from '../../store/wrapper.vue'
import { Namespaced, Store } from '../../store/types'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'
import { ISystemState } from '../../store/system'
import WithNav from '../../navigation/WithNav.vue'
import { BasicRoute } from '../../navigation/basicroute'

type State = {
    'chat': IChatState
    'system': ISystemState
}

type ChatStore = Store<State, Namespaced<ChatMutation, 'chat'>, Namespaced<ChatAction, 'chat'>>

@Component
class NavMixins extends WithNav<BasicRoute> {}

@Component
class StoreMixins extends VueWithStore<ChatStore> {}

@Component({
  components: {
    mdbIcon,
    InfiniteLoading
  },
  filters: {
    fromNow
  }
})
export default class ChatList extends Mixins(StoreMixins, NavMixins) {
  @Prop() readonly action!: (user: UserChat) => void|Promise<void>

  filterActive = 'keyword'
  q = ''
  defaultImg = require('../../../assets/img/avatar/user.png')

  get isBuyer (): boolean {
    return !this.tstore.state.system.isSeller
  }

  get isMobile (): boolean {
    return this.tstore.state.system.isMobile
  }

  get user (): UserChat {
    return this.tstore.state.chat.userActive
  }

  get showLoading (): boolean {
    const { contactLoading, userlist } = this.tstore.state.chat
    return userlist.length === 0 && contactLoading
  }

  get noResult (): boolean {
    const { contactLoading, userlist } = this.tstore.state.chat
    return userlist.length === 0 && !contactLoading
  }

  get userlist (): UserChat[] {
    const userlist = this.tstore.state.chat.userlist
    const data = userlist
      .filter(user => {
        if (this.q === '') {
          return true
        } else {
          return user.name.toLowerCase().search(this.q.toLowerCase()) !== -1
        }
      })
      .sort((currentUser, nextUser) => {
        if (currentUser.last_chat < nextUser.last_chat) {
          return 1
        }

        return -1
      })

    return data
  }

  async infiniteHandler ($state: StateChanger): Promise<void> {
    const { userlist, contactEndpage } = this.tstore.state.chat

    if (!contactEndpage && userlist.length) {
      await this.tstore.dispatch('chat/paginateContact')
    } else {
      await this.tstore.dispatch('chat/openContact')
    }

    if (contactEndpage) {
      $state.complete()
    } else {
      $state.loaded()
    }
  }

  async contactAction (user: UserChat): Promise<void> {
    if (this.user.id !== user.id || this.isMobile) {
      if (this.action) {
        // await this.tstore.dispatch('chat/openChat', user)
        // this.navigation.push('user_chat', {})
        this.action(user)
      } else {
        this.tstore.commit('chat/clear_order_product')
        await this.tstore.dispatch('chat/openChat', user)
      }
    }
  }
}

</script>
