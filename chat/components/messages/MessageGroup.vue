<template>
  <div>
    <div
      v-for="(group, index) in messageGroup"
      :key="index"
      :class="{
        'media my-2': true,
        'pr-5': !group.reverse,
        'pl-5': group.reverse,
        'flex-row-reverse': group.reverse
      }"
    >
      <div class="media-body mx-2">
        <div
          v-for="(message, index) in group.messages"
          :key="index"
        >
          <slot
            :message="message"
          ></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ChatUI } from '../../../model/chat'
import { Component, Prop } from 'vue-property-decorator'
import VueWithStore from '../../../store/wrapper.vue'
import { IUserState } from '../../../store/user'
import { Store } from '../../../store/types'

interface GroupMessage {
  key: string,
  messages: ChatUI[],
  reverse: boolean
}

type State = {
  'user': IUserState
}

// eslint-disable-next-line @typescript-eslint/ban-types
type UserStore = Store<State, {}, {}>

@Component
class StoreMixins extends VueWithStore<UserStore> {}

@Component
class MessageGroup extends StoreMixins {
  @Prop() readonly messages!: ChatUI[]

  get messageGroup (): GroupMessage[] {
    let id = ''
    const messageGroup: GroupMessage[] = []
    const { uid, shopid } = this.tstore.state.user

    this.messages.reverse().forEach(message => {
      if (id !== message.from_id) {
        let reverse = message.from_id === uid
        if (message.from_seller) {
          reverse = message.shopid === shopid
        }

        messageGroup.push({
          key: message.from_id,
          messages: [],
          reverse
        })
        id = message.from_id
      }

      messageGroup[messageGroup.length - 1]
        .messages.push(message)
    })

    return messageGroup
  }
}

export default MessageGroup
</script>
