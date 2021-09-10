<template>
  <div class="demo-static-toast pos-fixed t-60 r-10" style="z-index: 99999">

    <div v-for="notif in newNotif" :key="notif.id" class="toast">
      <div class="toast-header">
        <h6 class="tx-inverse tx-bold tx-12 mg-b-0 mg-r-auto">
          <mdb-icon v-if="notif.icon" :icon="notif.icon" class="mr-1" />
          {{ notif.title }}
        </h6>
        <small class="ml-5">{{ notif.created }}</small>
        <button type="button" class="ml-2 mb-1 close tx-normal" @click="() => closeId = [...closeId, notif.id]">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="toast-body d-flex">
        <div v-if="notif.image" class="mr-2 align-self-center">
          <img :src="notif.image" class="wd-40 ht-40 img-fit-cover rounded-5" />
        </div>
        <div class="flex-fill tx-12 tx-gray-700 align-self-center">
          {{ notif.body }}
        </div>
      </div>
    </div>

  </div>
</template>
<script lang="ts">
import { mdbIcon } from 'mdbvue'
import { fromNow } from '../../filters/moment'
import { Component } from 'vue-property-decorator'
import { INotifState, NotifMutation, NotifAction } from '../../store/notif'
import { Store, Namespaced } from '../../store/types'
import WithStore from '../../store/wrapper.vue'
import { INotif } from '../../model/notifs'
import currency from '../../filters/currency'

interface IToastNotif {
  id: string
  icon?: string
  title: string
  body: string
  image?: string
  created: string
  show: boolean
}

type State = {
  'notif': INotifState
}

type NotifStore = Store<State, Namespaced<NotifMutation, 'notif'>, Namespaced<NotifAction, 'notif'>>
class RootWithStore extends WithStore<NotifStore> {}

const notifTimeout = 100000

@Component({
  components: {
    mdbIcon
  }
})
class ToastNotification extends RootWithStore {
  closeId: string[] = []
  haveTimeoutId: string[] = []

  get newNotif (): IToastNotif[] {
    const newNotif = this.tstore.state.notif.newNotif

    return newNotif
      .reverse()
      .map(this.setNotifData)
      .filter(notif => notif.show && !this.closeId.includes(notif.id))
  }

  generateRandId (): string {
    return Math.random().toString(36).substring(7)
  }

  setNotifData (notif: INotif, index: number): IToastNotif {
    let [title, body] = ['', '']
    let image, icon

    const { id, created } = notif
    const show = index < 3

    if (show && !this.haveTimeoutId.includes(id)) {
      this.haveTimeoutId = [...this.haveTimeoutId, id]
      setTimeout(() => {
        this.closeId = [...this.closeId, id]
      }, notifTimeout)
    }

    if (
      notif.type === 'cancel_order' ||
      notif.type === 'auto_cancel_order' ||
      notif.type === 'submit_cancel_order' ||
      notif.type === 'new_order' ||
      notif.type === 'unverify_paid' ||
      notif.type === 'selesai' ||
      notif.type === 'confirm_order' ||
      notif.type === 'titip_order' ||
      notif.type === 'process_order' ||
      notif.type === 'karantina_order' ||
      notif.type === 'dikirim'
    ) {
      title = notif.title
      body = notif.body
      image = notif.image
      icon = 'shopping-bag'
    } else if (notif.type === 'new_chat') {
      title = 'Chat'
      body = 'Ada chat baru'
    } else if (notif.type === 'diskusi') {
      title = 'Diskusi'
      body = 'Ada diskusi baru, cek sekarang juga!'
    } else if (notif.type === 'ikan') {
      title = notif.ikan_name
      body = `Ikan koi ${notif.category} berkualitas dijual oleh ${notif.seller_name} dengan harga ${currency(notif.price)}`
      image = notif.image
    } else if (notif.type === 'system') {
      title = notif.title
      body = notif.body
      image = notif.image
    }

    return {
      id: id || created.toString(),
      title,
      body,
      image,
      icon,
      created: fromNow(parseInt(created + '')),
      show
    }
  }
}

export default ToastNotification
</script>
