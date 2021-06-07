<template>
  <div :class="`input-group wd-${ width }`">
    <a
      v-if="text"
      v-html="text"
      :class="`input-group-${ direction } input-group-text bg-gray-100`"
      @click="action()"
    ></a>
    <slot></slot>
  </div>
</template>
<style scoped>
  .input-group-append + input {
    border-right: 0px;
    border-radius: 0px;
    border-bottom-left-radius: 5px !important;
    border-top-left-radius: 5px !important;
    order: -1;
  }
  .input-group-append {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }
  .input-group-append + input {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }

  .input-group:focus-within span, .input-group:focus-within input {
    border-color: #e31f52;
  }
  .input-group-prepend + input {
    border-left: 0px;
  }
  .input-group-prepend {
    border-right: 0px;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }
</style>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class FormGroup extends Vue {
  @Prop({ default: 'auto' }) readonly width!: string
  @Prop({ default: '' }) readonly text!: string
  @Prop({ default: 'prepend' }) readonly direction!: string
  @Prop({
    default: () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {}
    }
  }) readonly action!: () => void
}
</script>
