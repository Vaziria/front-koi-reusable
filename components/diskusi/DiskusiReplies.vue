<template>
  <div>
    <BasicButton
      v-if="diskusi.has_reply && !showReply"
      type="info"
      class="tx-12 py-2"
      @click="showReplies()"
    >Lihat semua balasan</BasicButton>

    <div v-if="loading" class="mb-3">
      <div class="mb-2 d-flex">
        <div class="align-self-center mr-3">
          <div class="wd-30 ht-30 rounded-circle bg-loading"></div>
        </div>
        <div class="align-self-center flex-fill d-flex">
          <div class="flex-fill">
            <div class="wd-150 ht-15 bg-loading mb-1"></div>
            <div class="wd-100 ht-10 bg-loading mb-0"></div>
          </div>
        </div>
      </div>
      <div class="wd-100p ht-15 bg-loading mb-0"></div>
    </div>

    <div v-if="showReply">
      <DiskusiReply
        v-for="diskusi in allReplies"
        :key="diskusi.id"
        :diskusi="diskusi"
        class="mb-3"
      />
    </div>

    <BasicButton
      v-if="loadReply && showReply"
      type="info"
      class="tx-12 py-2"
      @click="hideReplies()"
    >Sembunyikan balasan</BasicButton>
  </div>
</template>
<script lang="ts">
import { Diskusi } from '../../model/diskusi'
import { Component, Vue, Prop } from 'vue-property-decorator'
import DiskusiReply from './DiskusiReply.vue'
import { getReplies } from '../../api/fireDikusi'
import BasicButton from '../../components/button/BasicButton.vue'

export type DiskusiWithReplies = Diskusi & {
  replies: Diskusi[]
}

@Component({
  components: {
    DiskusiReply,
    BasicButton
  }
})
class DiskusiReplies extends Vue {
  @Prop() readonly diskusi!: DiskusiWithReplies

  replies: Diskusi[] = []
  loadReply = false
  showReply = false
  loading = false

  get allReplies (): Diskusi[] {
    const replyIds: string[] = []
    return [...this.replies, ...this.diskusi.replies]
      .sort((currentDiskusi, nextDiskusi) => {
        const currentDate = currentDiskusi.last_reply || currentDiskusi.created
        const nextDate = nextDiskusi.last_reply || nextDiskusi.created
        return currentDate < nextDate ? -1 : 1
      })
      .filter(diskusi => {
        if (!replyIds.includes(diskusi.id)) {
          replyIds.push(diskusi.id)
          return true
        }

        return false
      })
  }

  async showReplies (): Promise<void> {
    this.showReply = true

    if (!this.loadReply) {
      await this.getReplies()
    }
  }

  hideReplies (): void {
    this.showReply = false
  }

  async getReplies (): Promise<void> {
    this.loading = true
    this.loadReply = true
    const { shopid, id } = this.diskusi
    const replies = await getReplies(shopid, id)

    this.replies = replies
    this.loading = false
  }
}

export default DiskusiReplies
</script>
