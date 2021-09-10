<template>
  <a
    :class="{
      'list-group-item px-3 bd-0 d-flex': true,
      'bg-gray-100': notif.unread
    }"
    @click="onAction()"
  >
    <div class="wd-100p">
      <div class="d-flex mb-2">
        <div class="flex-fill">
          <h6 class="tx-bold flex-fill mb-1"><mdb-icon icon="shopping-bag mr-2" />{{ notif.title }}</h6>
          <p class="tx-uppercase tx-gray-400 mb-0 tx-10">{{ notif.created | fromNow }}</p>
          <p class="tx-uppercase tx-gray-400 mb-0 tx-10">invoice#{{ notif.orderid }}</p>
        </div>
        <div class="mr-l align-self-center">
          <img
            :src="notif.image"
            class="wd-40 ht-40 img-fit-cover rounded-5"
            :alt="notif.type + '_' + notif.orderid"
          >
        </div>
      </div>
      <div class="d-flex">
        <div class="flex-fill">
          <p class="tx-gray-600 mb-0 tx-12 lh-1">{{ notif.body }}</p>
        </div>
      </div>
    </div>
  </a>
</template>
<script lang="ts">
import { mdbIcon } from 'mdbvue'
import { INotifOrder } from '../../model/notifs'
import { fromNow } from '../../filters/moment'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
    mdbIcon
  },
  filters: {
    fromNow
  }
})
class TransaksiCard extends Vue {
  @Prop() notif!: INotifOrder
  @Prop() action!: (notif: INotifOrder) => void

  onAction (): void {
    if (this.action) {
      this.action(this.notif)
    }
  }
}

export default TransaksiCard
</script>
