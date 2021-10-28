<template>
  <div class="b-30 bg-gray-200 pt-2 pb-3 px-3 wd-100p d-flex pos-absolute">
    <div class="card rounded-10">
      <div class="card-body p-1 d-flex">
        <div class="mr-2">
          <img
            :src="image"
            class="wd-40 ht-40 img-fit-cover rounded-10 shadow bd"
            alt=""
          >
        </div>
        <div class="align-self-center mg-x-3 text-truncate wd-150 lh-1">
          <p class="tx-12 mb-0">{{ title }}</p>
          <b>{{ price | currency }}</b>
        </div>
        <a class="align-self-center mx-2" @click="close()">
          <i class="fas fa-times"></i>
        </a>
      </div>
    </div>
  </div>
</template>
<style scoped>
.ht-40 {
  height: 40px !important;
}
</style>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import currency from '../../../filters/currency'

@Component({
  filters: {
    currency
  }
})
class ReplyItem extends Vue {
  @Prop() readonly image!: string
  @Prop() readonly title!: string
  @Prop() readonly price!: string

  @Emit('close')
  close (): void {
    return undefined
  }
}

export default ReplyItem
</script>
