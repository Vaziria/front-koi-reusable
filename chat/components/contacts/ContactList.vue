<template>
  <div
    :class="{
      'media new py-2': true,
      selected
    }"
    @click="$emit('click')"
  >
    <div :class="`wd-30 ht-30 az-img-user ${ contact.state }`">
      <img :src="photoProfile">
      <span v-if="contact.unread">{{ contact.unread }}</span>
    </div>
    <div class="media-body ellipsis">
      <div class="media-contact-name mb-0">
        <div class="tx-12 wd-80 ellipsis">
          {{ contactName }}
        </div>
        <span class="d-md-none">
          {{ parseInt(lastMsg.created) | fromNow }}
        </span>
      </div>
      <div
        v-if="!isSeller"
        class="badge badge-info"
      >Penjual</div>
      <div
        v-else-if="lastMsg.created"
        class="tx-gray-500 tx-12 ellipsis"
      >{{ lastMsg.text }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { UserChat } from '../../../model/chat'
import { Component, Prop } from 'vue-property-decorator'
import { fromNow } from '../../../filters/moment'
import { ISystemState } from '../../../store/system'
import { Store } from '../../../store/types'
import VueWithStore from '../../../store/wrapper.vue'
import { IChatState } from '../../../store/chat'

type State = {
  'chat': IChatState
  'system': ISystemState
}

// eslint-disable-next-line @typescript-eslint/ban-types
type ChatStore = Store<State, {}, {}>

@Component
class StoreMixins extends VueWithStore<ChatStore> {}

@Component({
  filters: {
    fromNow
  }
})
class ContactList extends StoreMixins {
  @Prop() readonly contact!: UserChat

  defaultImg = require('../../../assets/img/avatar/user.png')

  get isSeller (): boolean {
    return this.tstore.state.system.isSeller
  }

  get selected (): boolean {
    const { chat, system } = this.tstore.state
    if (!system.isMobile) {
      return chat.userActive.id === this.contact.id
    }

    return false
  }

  get contactName (): string {
    // eslint-disable-next-line camelcase
    const { name, seller_name } = this.contact
    // eslint-disable-next-line camelcase
    return name || seller_name
  }

  get photoProfile (): string {
    // eslint-disable-next-line camelcase
    const { photoUrl, profile_image } = this.contact
    // eslint-disable-next-line camelcase
    return photoUrl || profile_image || this.defaultImg
  }

  get lastMsg (): UserChat['last_msg'] {
    return this.contact.last_msg
  }
}

export default ContactList
</script>
