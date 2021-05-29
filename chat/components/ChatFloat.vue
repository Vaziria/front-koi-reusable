<template>
  <div v-if="!hidden" :class="{ 'pos-fixed b-30 r-80 d-none': true, 'd-md-block': !show }" style="z-index: 99999999">
    <div class="rounded-30 bg-white shadow py-2 px-4 bd tx-16 tx-info tx-bold d-flex" style="cursor: pointer;" @click="toggleShow()">
      <mdb-icon icon="comment" class="tx-26 mr-2" /> <span class="mg-t-2">Chat <span v-if="unreadChat">({{ unreadChat }})</span></span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mdbIcon } from 'mdbvue'
import { VueWithStore } from '../../store/wrapper.vue'
import { Namespaced, Store } from '../../store/types'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'
// import { BaseRoute } from '@/router/base'

// type allowRoute = keyof BaseRoute

type State = {
    'chat': IChatState
}

type ChatStore = Store<State, Namespaced<ChatMutation, 'chat'>, Namespaced<ChatAction, 'chat'>>

@Component({
  components: {
    mdbIcon
  }
})
export default class ChatFloat extends VueWithStore<ChatStore> {
  get unreadChat (): number {
    return this.tstore.state.chat.unread
  }

  get show (): boolean {
    return this.tstore.state.chat.showMini
  }

  get hidden (): boolean {
    //   hidden chat float not implemented

    // const currentRoute = this.$route.name + ''
    // const hiddenRoute: allowRoute[] = ['order_item']
    // const findHidden = hiddenRoute.find(route => route === currentRoute)

    // if (findHidden) {
    //   return true
    // }

    return false
  }

  async toggleShow (): Promise<void> {
    this.tstore.commit('chat/mini_show', !this.show)
    this.tstore.commit('chat/reset_unread')
    if (this.show) {
      await this.tstore.dispatch('chat/open')
    }
  }
}

</script>
