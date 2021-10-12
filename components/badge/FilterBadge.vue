<template>
  <a
    :class="{
      'badge bd px-3 py-2 mr-2 mb-2 rounded-10 tx-12 tx-md-14 tx-normal': true,
      'active': active
    }"
    @click="$emit('click')"
  >
    <slot>
      <span v-html="text"></span>
    </slot>
    <a v-if="destroy" class="ml-2" @click="$emit('destroy')">
      <mdb-icon icon="times" class="tx-info" />
    </a>
  </a>
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
import { mdbIcon } from 'mdbvue'

@Component({
  components: {
    mdbIcon
  }
})
class FilterBadge extends Vue {
  @Prop() readonly text!: string
  @Prop({ default: false }) readonly active!: boolean
  @Prop() readonly destroy!: boolean
}

export default FilterBadge
</script>
