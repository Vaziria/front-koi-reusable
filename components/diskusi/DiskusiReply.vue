<template>
  <div>
    <div class="mb-2 d-flex">
      <img
        :src="diskusi.img_profile || defaultImg"
        class="wd-30 ht-30 img-fit-cover rounded-circle align-self-center mr-3"
      >
      <div class="align-self-center flex-fill d-flex">
        <div class="flex-fill">
          <p class="mb-0">{{ diskusi.name }}</p>
          <p class="tx-10 mb-0">{{ diskusi.created | date('DD MN YY') }}</p>
        </div>
        <div v-if="showBadge" class="align-self-center">
          <span class="badge badge-info">{{ repliedText }}</span>
        </div>
      </div>
    </div>
    <p class="tx-gray-800 ml-text">{{ diskusi.text }}</p>

    <slot></slot>
  </div>
</template>
<style scoped>
.ml-text {
  margin-left: calc(30px + 1rem);
}
.ht-30 {
  height: 30px !important;
}
</style>
<script lang="ts">
import { Diskusi } from '../../model/diskusi'
import { Component, Vue, Prop } from 'vue-property-decorator'
import date from '../../filters/date'

@Component({
  filters: {
    date
  }
})
class DiskusiReply extends Vue {
  @Prop() readonly diskusi!: Diskusi
  @Prop() readonly showBadge!: boolean

  defaultImg = require('@/assets/img/avatar/user.png')

  get repliedText (): string {
    if (this.diskusi.replied) {
      return 'replied'
    }

    return 'unreply'
  }
}

export default DiskusiReply
</script>
