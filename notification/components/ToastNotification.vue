<template>
  <div class="demo-static-toast pos-fixed t-60 r-10" style="z-index: 99999">

    <div v-for="notif in newNotif" :key="notif.id" class="toast">
      <div class="toast-header">
        <h6 class="tx-inverse tx-14 mg-b-0 mg-r-auto">{{ notif.title }}</h6>
        <small class="ml-5">{{ notif.created }}</small>
        <button type="button" class="ml-2 mb-1 close tx-normal" @click="() => closeId = [...closeId, notif.id]">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="toast-body">
        {{ notif.body }}
      </div>
    </div>

  </div>
</template>
<script lang="ts">
import { fromNow } from '../../filters/moment'
import { Notif } from '../../model/notif'
import { Component } from 'vue-property-decorator'
import { INotifState, NotifMutation, NotifAction } from '../../store/notif'
import { Store, Namespaced } from '../../store/types'
import WithStore from '../../store/wrapper.vue'

interface IToastNotif {
  id: string
  title: string
  body: string
  image?: string
  created: string
  isShow: boolean
}

type State = {
  'notif': INotifState
}

type NotifStore = Store<State, Namespaced<NotifMutation, 'notif'>, Namespaced<NotifAction, 'notif'>>
class RootWithStore extends WithStore<NotifStore> {}

@Component
class ToastNotification extends RootWithStore {
  closeId: string[] = []
  haveTimeoutId: string[] = []
  notifTimeout = 30000
  filteredNotif: Notif['type'][] = ['diskusi', 'update_order', 'new_order', 'new_chat', 'ikan']

  get newNotif (): IToastNotif[] {
    const newNotif = [...this.tstore.state.notif.newNotif]
      .filter(notif => this.filteredNotif.includes(notif.type))

    return newNotif
      .reverse()
      .map(this.setNotifData)
      .filter(notif => notif.isShow && !this.closeId.includes(notif.id))
  }

  generateRandId (): string {
    return Math.random().toString(36).substring(7)
  }

  setNotifData (notif: Notif, index: number): IToastNotif {
    let { title, body } = notif
    let image
    body = body || ''

    const id = notif.id || this.generateRandId()
    const created = fromNow(parseInt(notif.created + ''))
    const isShow = index < 3

    if (isShow && !this.haveTimeoutId.includes(id)) {
      this.haveTimeoutId = [...this.haveTimeoutId, id]
      setTimeout(() => {
        this.closeId = [...this.closeId, id]
      }, this.notifTimeout)
    }

    if (notif.type === 'new_chat') {
      title = 'Chat'
      body = 'Ada chat baru'
    } else if (notif.type === 'diskusi') {
      title = 'Diskusi'
      body = notif.title
    } else if (notif.type === 'ikan') {
      title = 'Ikan'
      body = notif.name
      image = notif.gambar
    } else if (notif.type === 'update_order') {
      title = 'order'
      body = notif.title
    }

    return {
      id,
      title,
      body,
      image,
      created,
      isShow
    }
  }
}

export default ToastNotification
</script>
