<template>
  <div>
    <textarea
      v-model="text"
      :class="{
        'form-control rounded-5 tx-12 mb-3': true,
        'bd-info': focus || isFocus
      }"
      placeholder="Balas diskusi di sini..."
      :rows="rows"
      :disabled="processSend"
      @blur="onFocus(false)"
      @focus="onFocus(true)"
    ></textarea>

    <div v-if="focus" class="d-flex flex-row-reverse">
      <BasicButton
        :type="sendColor"
        :disabled="!text"
        class="tx-12 py-2 px-4"
        @click="sendReply()"
      >Kirim</BasicButton>
      <BasicButton
        type="outline-info"
        class="tx-12 py-2 px-4 mr-3"
        @click="resetFocus()"
      >Batal</BasicButton>
    </div>
  </div>
</template>
<style scoped>
textarea {
  resize: none;
  overflow: hidden;
}
.bd-info {
  border-color: #e31f52 !important;
}
</style>
<script lang="ts">
import { sendDiskusi } from '../../api/diskusi'
import { Component, Prop, Emit } from 'vue-property-decorator'
import BasicButton from '../../components/button/BasicButton.vue'
import { ISystemState } from '../../store/system'
import { Store } from '../../store/types'
import VueWithStore from '../../store/wrapper.vue'

type State = {
  'system': ISystemState
}

// eslint-disable-next-line @typescript-eslint/ban-types
type ChatStore = Store<State, {}, {}>

@Component
class StoreMixins extends VueWithStore<ChatStore> {}

@Component({
  components: {
    BasicButton
  }
})
class DiskusiForm extends StoreMixins {
  @Prop() readonly shopid!: string
  @Prop() readonly ikanid!: string
  @Prop() readonly replyid!: string
  @Prop() readonly focus!: boolean

  isFocus = false
  text = ''
  processSend = false

  get sendColor (): string {
    if (this.text) {
      return 'info'
    }

    return 'light'
  }

  get rows (): number {
    if (!this.isFocus && !this.focus) {
      return 1
    }

    const defaultRows = 4
    const enterCount = this.text.split(/\r|\r\n|\n/).length
    if (enterCount > defaultRows) {
      return enterCount
    }

    return defaultRows
  }

  async sendReply (): Promise<void> {
    this.processSend = true
    const { shopid, ikanid, replyid, text } = this
    const { isSeller } = this.tstore.state.system
    this.resetFocus()

    await sendDiskusi(shopid, ikanid, {
      reply_id: replyid,
      text
    }, isSeller)
    this.processSend = false
  }

  @Emit('focus')
  onFocus (focus: boolean): boolean {
    this.isFocus = focus
    return focus
  }

  @Emit('reset')
  resetFocus (): void {
    this.isFocus = false
    this.text = ''
    return undefined
  }
}

export default DiskusiForm
</script>
