<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { BasicRoute } from '../navigation/basicroute'
import WithNav from '../navigation/WithNav.vue'
import { ChatAction, ChatMutation, IChatState } from '../store/chat'
import { ISystemState } from '../store/system'
import { Namespaced, Store } from '../store/types'
import VueWithStore from '../store/wrapper.vue'

type State = {
  'chat': IChatState
  'system': ISystemState
}

type ChatStore = Store<State, Namespaced<ChatMutation, 'chat'>, Namespaced<ChatAction, 'chat'>>

@Component
class StoreMixins extends VueWithStore<ChatStore> {}
@Component
class NavMixins extends WithNav<BasicRoute> {}

@Component
export default class WithChat extends Mixins(StoreMixins, NavMixins) {
  get isMobile (): boolean {
    return this.tstore.state.system.isMobile
  }

  get isSeller (): boolean {
    return this.tstore.state.system.isSeller
  }

  async toChat (shopid: string): Promise<void> {
    this.tstore.commit('chat/reset_user')
    this.tstore.commit('chat/reset_message')

    if (this.isMobile) {
      this.navigation.push('user_chat', {})
    } else {
      this.tstore.commit('chat/mini_show', true)
    }

    await this.tstore.dispatch('chat/openChat', shopid)
  }
}

</script>
