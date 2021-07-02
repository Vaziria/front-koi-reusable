<template>
  <a
    v-html="text"
    :class="{
      'badge bd px-3 py-2 mr-2 mb-2 rounded-10 tx-12 tx-normal': true,
      'active': active
    }"
    @click="$emit('click')"
  />
</template>
<style scoped>
  .active {
    background: #ffbdce !important;
    color: #e31f52 !important;
    border-color: #ffbdce !important;
    font-weight: bold;
  }
</style>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
class FilterBadge extends Vue {
  @Prop() readonly text!: string
  @Prop({ default: false }) readonly active!: boolean
}

export default FilterBadge
</script>
