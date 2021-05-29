<template>
  <mdb-modal
    side
    position="top-right"
    fullHeight
    removeBackdrop
    scrollable
    direction="bottom"
    :show="true"
    size="lg"
    class="chat d-none d-md-block"
    style="z-index: 99999999;"
  >
    <mdb-modal-body class="p-0 row m-0">
      <chat-list :active="active" class="col-4 col-lg-3 p-0 bd-r"/>
      <chat v-if="showChatbox" class="col-8 col-lg-9 p-0" mini/>
      <div v-else class="col-8 col-lg-9 p-0 tx-center p-2">
        <a class="mg-t-10 ml-2 mr-3 d-none d-md-block tx-right" @click="close()"><mdb-icon icon="times tx-18" /></a>
        <mdb-icon icon="comments" size=7x />
        <h4 class="tx-bold">Selamat Datang di Chat</h4>
        <h6 class="tx-gray-700">Silahkan pilih pesan untuk memulai.</h6>
      </div>
    </mdb-modal-body>
  </mdb-modal>
</template>
<style scoped>
  .fa-7x {
    margin-top: calc(50% - 175px);
  }
</style>
<style>
  .chat .modal-full-height {
    height: 100% !important;
    margin: 0px;
    bottom:0;
    margin-left: auto;
    right:20px;
  }
  .chat .modal-full-height .modal-content {
    z-index: 1000;
    height: 70% !important;
    max-width: 660px !important;
    position: absolute;
    bottom: -16px;
    border-radius: 10px;
    right: 0;
    max-width: 100%;
    border: 1px solid #cdd4e0;
    border-bottom-width: 0px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .chat .modal-full-height .modal-content .modal-header {
    border: 0;
  }
  .chat .modal-dialog-scrollable {
    max-height: calc(100% - 7rem);
  }
</style>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mdbIcon, mdbModal, mdbModalBody } from 'mdbvue'
import { Component, Prop } from 'vue-property-decorator'
import Chat from './ChatBox.vue'
import ChatList from './ChatList.vue'
import { VueWithStore } from '../../store/wrapper'
import { Namespaced, Store } from '../../store/types'
import { ChatAction, ChatMutation, IChatState } from '../../store/chat'

type State = {
    'chat': IChatState
}

type ChatStore = Store<State, Namespaced<ChatMutation, 'chat'>, Namespaced<ChatAction, 'chat'>>

@Component({
  components: {
    mdbIcon,
    mdbModal,
    mdbModalBody,
    Chat,
    ChatList
  }
})
export default class ChatMini extends VueWithStore<ChatStore> {
  @Prop() readonly shopid!: string

  active = {}

  get show (): boolean {
    return this.tstore.state.chat.showMini
  }

  get userid (): string {
    return this.tstore.state.chat.userid
  }

  get showChatbox (): boolean {
    const show = this.tstore.state.chat.userActive.id !== ''
    return show
  }

  close (): void {
    this.tstore.commit('chat/mini_show', false)
  }
}

</script>
