<template>
  <div>
    <h5 v-if="!isMobile" class="tx-bold p-2 d-flex tx-16">Chat <a class="mg-l-auto"><mdb-icon icon="cog" /></a></h5>
    <div class="d-flex">
      <div v-if="!isMobile" class="input-group mx-2">
        <input v-if="filterActive === 'keyword'" v-model="q" class="form-control tx-12 ht-30" placeholder="Cari pengguna">
        <a class="input-group-prepend input-group-text mr-2 px-2" @click="filterActive !== 'keyword' && (filterActive = 'keyword')"><mdb-icon icon="search" /></a>
        <a v-if="filterActive === 'keyword'" class="input-group-prepend input-group-text mr-2  px" @click="filterActive = 'filter'"><mdb-icon icon="filter" /></a>
        <v-select v-if="filterActive === 'filter'" :options="['Semua', 'Belum Dibaca', 'Sudah Dibaca']" class="chatlist form-control p-0" />
      </div>
    </div>
    <div id="azChatList" class="az-chat-list mt-2 overflow-auto">
      <div v-for="(chat, key) in userlist" :key="key" :class="{ 'media new py-2': true, selected: user.id === chat.id }" @click="setActive(chat)">
        <div :class="`wd-30 ht-30 az-img-user ${ chat.state }`">
          <img :src="chat.photoUrl || chat.profile_image || defaultImg" alt="">
          <span v-if="chat.unread">{{ chat.unread }}</span>
        </div>
        <div class="media-body ellipsis">
          <div class="media-contact-name mb-0">
            <div class="tx-12 wd-80 ellipsis">{{ chat.name || chat.displayName || chat.seller_name }}</div>
            <span class="d-md-none">{{ parseInt(chat.last_msg.created) | fromNow }}</span>
          </div>
          <div v-if="isBuyer" class="badge badge-info">Penjual</div>
          <div v-else-if="chat.last_msg.created" class="tx-gray-500 tx-12 ellipsis">{{ chat.last_msg.text }}</div>
        </div>
      </div>
      <InfiniteLoading ref="infiniteLoading" @infinite="infiniteHandler">
        <div slot="spinner">
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
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </InfiniteLoading>

    </div>
  </div>
</template>
<style scoped>
  .form-control::placeholder {
    font-size: 12px;
  }
  .form-control {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .input-group-prepend {
    border-radius: 5px;
  }
  .form-control + .input-group-prepend {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
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
</style>
<style>
  #azChatList {
    position: absolute;
    width: 100%;
    height: calc(100% - 81px) !important;
  }
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
import { Component, Mixins } from 'vue-property-decorator'
import InfiniteLoading from 'vue-infinite-loading'

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

  get userlist (): UserChat[] {
    const userlist = this.tstore.state.chat.userlist
    const data = userlist.filter(user => {
      if (this.q === '') {
        return true
      } else {
        return user.name.toLowerCase().search(this.q.toLowerCase()) !== -1
      }
    })

    return data
  }

  mounted (): void {
    this.tstore.commit('chat/set_contact_ref', (this.$refs.infiniteLoading as InfiniteLoading).stateChanger)
  }

  async infiniteHandler (): Promise<void> {
    if (this.tstore.state.chat.userlist.length) {
      await this.tstore.dispatch('chat/paginateContact')
    }
  }

  async setActive (user: UserChat): Promise<void> {
    if (this.isMobile) {
      await this.tstore.dispatch('chat/openChat', user)
      this.navigation.push('user_chat', {})
    } else {
      this.tstore.commit('chat/clear_order_product')
      await this.tstore.dispatch('chat/openChat', user)
    }
  }
}

</script>
