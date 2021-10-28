<template>
  <div
    :class="{
      'az-msg-wrapper rounded-5 p-2': true,
      'op-5': unsend || error,
      pointer: error
    }"
    @click="$emit('click')"
  >
    <div class="d-flex tx-12">
      <span class="wrap mr-2">{{ text }}</span>
      <small class="d-block tx-right ml-auto align-self-end op-5">
        <span class="mr-1">{{ parseInt(date) | moment('HH:mm:ss') }}</span>
        <i v-if="unsend" class="fas fa-clock" />
        <i v-if="error" class="fas fa-exclamation-triangle" />
      </small>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from '../../../filters/moment'

@Component({
  filters: {
    moment
  }
})
class ChatDialog extends Vue {
  @Prop() readonly text!: string
  @Prop() readonly unsend!: boolean
  @Prop() readonly date!: number
  @Prop() readonly error!: boolean
}

export default ChatDialog

</script>
