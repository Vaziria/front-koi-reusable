<template>
  <span class="pos-relative">
    <span v-if="count" class="counter badge badge-pill badge-info pd-y-3 pd-x-5">{{ count | counter }}</span>
    <slot />
  </span>
</template>
<style scoped>
.counter {
  position: absolute;
  top: -10px;
  right: -10px;
  align-items: center;
  font-size: 9px;
  font-weight: 500;
  box-shadow: 0 0 0 2px #fff;
}
</style>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  filters: {
    counter (count: number): string {
      if (count > 99) {
        return '99+'
      }

      return count.toString()
    }
  }
})
class IconCounter extends Vue {
  @Prop() readonly count!: number
}

export default IconCounter

</script>
