<template>
  <a
    class="list-group-item bd-x-0 px-0 d-flex"
    @click="$emit('click')"
  >
    <!-- sub text -->
    <span
      v-if="sub"
      class="ml-4 tx-gray-600"
    >{{ text }}</span>
    <!-- main text -->
    <span
      v-else
      class="tx-bold"
    >{{ text }}</span>
    <!-- radio -->
    <form class="mg-l-auto">
    <label class="rdiobox">
      <input
        type="radio"
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
}

export default MobileRadio
</script>
