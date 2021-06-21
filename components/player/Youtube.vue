<template>
  <div v-if="YTid" ref="ytmain">
    <div class="overflow-auto" :style="containerStyle">
      <nav class="nav nav-pills d-flex flex-fill">
        <a
          v-for="rest in resolutionList"
          :key="rest"
          :class="{
            'nav-link': true,
            active: resolutionActive === rest
          }"
          @click="resolutionActive = rest"
        >{{ rest }}</a>
      </nav>
    </div>
    <video-embed
      :css="`embed-responsive-${resolution}`"
      :src="`https://www.youtube.com/watch?v=${YTid}`"
    />
  </div>
</template>
<style scoped>
  .nav {
    flex-wrap: nowrap !important;
    background: #000 !important;
  }
  .nav-link {
    color: #fff !important;
  }
  .nav-link.active {
    background: #ed3263 !important;
  }
</style>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

type YTResolution = '21:9' | '16:9' | '4:3' | '1:1'
const resolutionList: YTResolution[] = ['21:9', '16:9', '4:3', '1:1']

@Component
class YoutubePlayer extends Vue {
  @Prop() readonly YTid!: string

  resolutionList = resolutionList
  resolutionActive: YTResolution = '16:9'
  width = 0

  get resolution (): string {
    return this.resolutionActive.replace(':', 'by')
  }

  get containerStyle (): { width: string } {
    return {
      width: `${this.width}px`
    }
  }

  mounted (): void {
    const getRef = this.$refs.ytmain as HTMLDivElement
    this.width = getRef.clientWidth
  }
}

export default YoutubePlayer
</script>
