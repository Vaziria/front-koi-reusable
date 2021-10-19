<template>
  <a
    class="list-group-item bd-x-0 px-0 d-flex"
    @click="$emit('click')"
  >
    <!-- text -->
    <span :class="textClass">
      <slot>{{ text }}</slot>
    </span>
    <!-- radio -->
    <form class="mg-l-auto">
    <label class="ckbox">
      <input
        type="checkbox"
        :checked="active"
      >
      <span></span>
    </label>
    </form>
  </a>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
class MobileRadio extends Vue {
  @Prop() readonly text!: string
  @Prop() readonly active!: boolean
  @Prop() readonly sub!: boolean

  get textClass (): Record<string, boolean> {
    return {
      'ml-4 tx-gray-600': this.sub,
      'tx-bold': !this.sub
    }
  }
}

export default MobileRadio
</script>
