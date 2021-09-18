<template>
  <div class="b-30 bg-gray-200 pt-2 pb-3 px-3 wd-100p d-flex pos-absolute .fixed-bottom">
    <div class="card rounded-10">
      <div class="card-body p-1 d-flex">
        <div class="wd-40 ht-40 img-layering mr-3 rounded-10 shadow bd" :style="imgLayer"></div>
        <b class="mg-t-10 mg-l-5 ellipsis wd-100">{{ text }}</b>
        <a class="p-1 align-self-center" @click="action()"><i class="fas fa-times"></i></a>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
class ChatReply extends Vue {
  @Prop() readonly image!: string
  @Prop() readonly text!: string
  @Prop() readonly action!: () => void

  get imgLayer (): { 'background-image': string } {
    return { 'background-image': `url(${this.image})` }
  }
}

export default ChatReply
</script>
<style scoped>
  .fixed-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>
