<template>
  <div class="az-chat-footer ht-auto">
    <a class="az-msg-send"></a>
    <a class="az-msg-send pos-absolute b-5 l-15">
      <i class="fas fa-grin-alt tx-gray-500"></i>
    </a>
    <textarea
      v-model="text"
      type="text"
      class="form-control my-1 mx-4"
      placeholder="Type your message here..."
      :rows="rowsText"
    >
    </textarea>
    <a class="az-msg-send"></a>
    <a class="az-msg-send pos-absolute b-5 r-20" @click="sendMessage()">
      <i class="fas fa-paper-plane tx-info"></i>
    </a>
  </div>
</template>
<style scoped>
  .az-chat-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  textarea {
    resize:none;
    box-sizing:border-box;
    margin:auto;
  }
</style>
<script lang="ts">
import { Chat } from '../../model/chat'
import { Mixins, Component, Emit } from 'vue-property-decorator'
import SwalMixin from '../../mixins/swal.vue'
import { IChatState, ChatMutation, ChatAction } from '../../store/chat'
import { Namespaced, Store } from '../../store/types'
import { VueWithStore } from '../../store/wrapper'
import { IUserState, UserMutation } from '../../store/user'

type State = {
    'chat': IChatState,
    'user': IUserState
}

type ChatStore = Store<State,
    Namespaced<UserMutation, 'user'> &
    Namespaced<ChatMutation, 'chat'>,
    Namespaced<ChatAction, 'chat'>>

@Component
class StoreMix extends VueWithStore<ChatStore> {}

@Component
class ChatForm extends Mixins(StoreMix, SwalMixin) {
  text = ''

  get rowsText (): number {
    const textBreak = this.text.split('\n').length
    if (textBreak < 6) {
      return textBreak
    }
    return 6
  }

  get fromId (): string {
    return this.tstore.state.user.uid
  }

  get toId (): string {
    return this.tstore.state.chat.userActive.id
  }

  @Emit('onChat')
  async sendMessage (): Promise<void> {
    if (!this.text) {
      this.topedToast('Pesan Anda kosong.', 'OK')
    }

    const id = Math.random().toString(36).substring(6)
    const created = new Date().getTime()

    const chat: Chat = {
      id,
      created,
      from_id: this.fromId,
      text: this.text,
      to_id: this.toId
    }

    this.text = ''

    await this.tstore.dispatch('chat/sendChat', chat)
  }
}

export default ChatForm
</script>
