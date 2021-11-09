<template>
  <div :id="diskusi.id" :style="scrollClass">
    <div class="mb-2 d-flex">
      <img
        :src="diskusi.img_profile || defaultImg"
        class="wd-30 ht-30 img-fit-cover rounded-circle align-self-center mr-3"
      >
      <div class="align-self-center flex-fill d-flex">
        <div class="flex-fill lh-3">
          <p class="mb-0 tx-bold">
            {{ diskusi.name }}
            <span
              v-if="diskusi.userid === shopid"
              class="badge badge-info"
            >Penjual</span>
          </p>
          <p class="tx-10 tx-gray-500 mb-0">{{ diskusi | diskusiDate }}</p>
        </div>
        <div v-if="showBadge" class="align-self-center">
          <span class="badge badge-info">{{ repliedText }}</span>
        </div>
      </div>
    </div>
    <p class="ml-text">{{ diskusi.text }}</p>

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
    diskusiDate (diskusi: Diskusi): string {
      // eslint-disable-next-line camelcase
      const { created, last_reply } = diskusi
      const format = 'DD MN YY'
      const diskusiDate = date(created, format)

      // eslint-disable-next-line camelcase
      if (last_reply) {
        const diskusiDates = diskusiDate.split(' ')
        // eslint-disable-next-line camelcase
        const lastReplyDates = date(last_reply, format).split(' ')

        if (diskusiDates[2] !== lastReplyDates[2]) {
          const dateFrom = `${diskusiDates[0]} ${diskusiDates[1].slice(0, 3)} ${diskusiDates[2]}`
          const dateTo = `${lastReplyDates[0]} ${lastReplyDates[1].slice(0, 3)} ${lastReplyDates[2]}`
          return `${dateFrom} - ${dateTo}`
        }

        if (diskusiDates[1] !== lastReplyDates[1]) {
          const dateFrom = `${diskusiDates[0]} ${diskusiDates[1].slice(0, 3)}`
          const dateTo = `${lastReplyDates[0]} ${lastReplyDates[1].slice(0, 3)}`
          return `${dateFrom} - ${dateTo} ${diskusiDates[2]}`
        }

        if (diskusiDates[0] !== lastReplyDates[0]) {
          return `${diskusiDates[0]} - ${lastReplyDates[0]} ${diskusiDates[1]} ${diskusiDates[2]}`
        }
      }

      return diskusiDate
    }
  }
})
class DiskusiReply extends Vue {
  @Prop() readonly diskusi!: Diskusi
  @Prop() readonly shopid!: string
  @Prop() readonly showBadge!: boolean
  @Prop({ default: 60 }) readonly topScrollSpacing!: number

  defaultImg = require('../../assets/img/avatar/user.png')

  get scrollClass (): Record<string, string> {
    return {
      'padding-top': `${this.topScrollSpacing}px !important`,
      'margin-top': `${-this.topScrollSpacing}px !important`
    }
  }

  get repliedText (): string {
    if (this.diskusi.replied) {
      return 'replied'
    }

    return 'unreply'
  }
}

export default DiskusiReply
</script>
