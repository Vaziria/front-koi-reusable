<template>
  <button
    :class="`btn tx-bold px-3 rounded-5 btn-${type}`"
    @click="$emit('click')"
  ><slot /></button>
</template>
<style scoped>
  .btn {
    min-height: 30px;
    padding: 0px;
  }
</style>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
class BasicButton extends Vue {
  @Prop() readonly type!: string
}

export default BasicButton
</script>
