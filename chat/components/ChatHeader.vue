<template>
  <div class="p-2 pos-head-fixed pos-md-block t-0 bg-white z-index-200 wd-100p bd-b shadow-base d-flex">
    <a v-if="showClose" class="mg-t-10 ml-2 mr-3 d-md-none" @click="close()">
      <i class="fas fa-times tx-18" />
    </a>
    <a v-else class="mg-t-10 ml-2 mr-3 d-md-none" @click="mobileClose()">
      <i class="fas fa-arrow-left tx-18" />
    </a>

    <div :class="`az-img-user ${ user.state } mr-2`">
      <img :src="image">
    </div>
    <div class="mt-1 flex-fill">
      <h6 class="tx-bold mb-0">{{ user.seller_name || user.name || user.displayName }}<br>
        <small v-if="user.state === 'online'" class="tx-gray-400">online</small>
        <small v-else-if="user.last_chat" class="tx-gray-400">Terakhir online {{ parseInt(user.last_chat) | fromNow }}</small>
      </h6>
    </div>

    <mdb-dropdown v-if="headersActions.length" class="mg-t-10 mr-2">
      <a slot="toggle"><i class="fas fa-ellipsis-v tx-18" /></a>
      <mdb-dropdown-menu class="bd-1 rounded-5">
        <mdb-dropdown-item
          v-for="(haction, index) in headersActions"
          :key="index"
          @click="haction.action()"
        >{{ haction.name }}</mdb-dropdown-item>
      </mdb-dropdown-menu>
    </mdb-dropdown>
    <a v-if="showClose" class="mg-t-10 ml-2 mr-3 d-none d-md-block" @click="close()">
      <i class="fas fa-times tx-18" />
    </a>
  </div>
</template>
<script lang="ts">
import { mdbDropdown, mdbDropdownItem, mdbDropdownMenu } from 'mdbvue'
import { UserChat } from '../../model/chat'
import { ISystemState } from '../../store/system'
import { Component, Mixins } from 'vue-property-decorator'
import { fromNow } from '../../filters/moment'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'
import { Store, Namespaced } from '../../store/types'
import VueWithStore from '../../store/wrapper.vue'
import WithNav from '../../navigation/WithNav.vue'
import { BasicRoute } from '../../navigation/basicroute'

type State = {
  'chat': IChatState,
  'system': ISystemState
}

type ChatStore = Store<State, Namespaced<ChatMutation, 'chat'>, Namespaced<ChatAction, 'chat'>>

interface HeaderAction {
  name: string
  action: () => void
}

@Component
class StoreMixins extends VueWithStore<ChatStore> {}

@Component
class NavMixins extends WithNav<BasicRoute> {}

@Component({
  components: {
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu
  },
  filters: {
    fromNow
  }
})
class ChatHeader extends Mixins(NavMixins, StoreMixins) {
  get showClose (): boolean {
    return this.tstore.state.system.isMobile !== true
  }

  get headersActions (): HeaderAction[] {
    const headersActions: HeaderAction[] = []

    if (this.tstore.state.system.isSeller) {
      headersActions.push({
        name: 'Beri Rekomendasi',
        action: () => {
          this.tstore.commit('chat/toogleShowRecomend', true)
          this.tstore.commit('chat/mini_show', false)
        }
      })
    }

    return headersActions
  }

  get user (): UserChat {
    return this.tstore.state.chat.userActive
  }

  get image (): string {
    const defaultImg = () => require('../../../assets/img/avatar/user.png')
    return this.user.photoUrl || this.user.profile_image || defaultImg()
  }

  close (): void {
    this.tstore.commit('chat/mini_show', false)
  }

  mobileClose (): void {
    this.$router.go(-1)
  }
}

export default ChatHeader
</script>
