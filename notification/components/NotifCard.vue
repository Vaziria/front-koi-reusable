<template>
  <a
    :class="{
      'list-group-item px-3 bd-x-0 bd-gray-200 d-flex': true,
      'bg-gray-100': notif.unread && haveNotifCount
    }"
    @click="onAction()"
  >
    <div class="wd-100p">
      <div class="d-flex">
        <div class="flex-fill mr-3">
          <h6 class="tx-bold flex-fill mb-1">{{ title }}</h6>
          <p class="tx-gray-400 mb-0 tx-10">{{ notif.created | fromNow }}</p>
          <p class="tx-gray-400 mb-0 tx-12">{{ desc }}</p>
        </div>
        <div v-if="image" class="align-self-center">
          <img
            :src="image"
            class="wd-40 ht-40 img-fit-cover rounded-5"
          >
        </div>
      </div>
    </div>
  </a>
</template>
<script lang="ts">
import { mdbIcon } from 'mdbvue'
import { INotif } from '../../model/notifs'
import { fromNow } from '../../filters/moment'
import { Component, Prop } from 'vue-property-decorator'
import { INotifState, NotifAction, NotifMutation } from '../../store/notif'
import { Namespaced, Store } from '../../store/types'
import VueWithStore from '../../store/wrapper.vue'

type State = {
  'notif': INotifState
}

type NotifStore = Store<State, Namespaced<NotifMutation, 'notif'>, Namespaced<NotifAction, 'notif'>>

@Component
class StoreMixins extends VueWithStore<NotifStore> {}

@Component({
  components: {
    mdbIcon
  },
  filters: {
    fromNow
  }
})
class TransaksiCard extends StoreMixins {
  @Prop() notif!: INotif
  @Prop() action!: (notif: INotif) => void

  get haveNotifCount (): boolean {
    return this.tstore.state.notif.unreadCount > 0
  }

  get type (): INotif['type'] {
    return this.notif.type
  }

  get title (): string {
    const notif = this.notif

    if (notif.type === 'ikan') {
      return notif.ikan_name
    } else if (notif.type === 'system' || notif.type === 'diskusi') {
      return notif.title
    }

    return ''
  }

  get desc (): string {
    const notif = this.notif
    if (notif.type === 'ikan') {
      return 'cek sekarang juga'
    } else if (notif.type === 'system') {
      return notif.body
    } else if (notif.type === 'diskusi') {
      return 'cek diskusi kamu sekarang juga'
    }

    return ''
  }

  get image (): string {
    const notif = this.notif

    if (notif.type === 'ikan') {
      return notif.image
    } else if (notif.type === 'system') {
      return notif.image || ''
    }

    return ''
  }

  onAction (): void {
    if (this.action) {
      this.action(this.notif)
    }
  }
}

export default TransaksiCard
</script>
