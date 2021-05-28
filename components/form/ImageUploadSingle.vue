<template>
  <label :for="randomId" :class="Object.assign({ [classer]: true, disabled }, { [addClass]: true })" :style="imageLayer">
    <div v-if="value && !noClose" class="pos-absolute z-index-10 tx-info" style="top: -15px; right: -10px">
      <a class="close-hover" @click.prevent="$emit('input', null)">
        <mdb-icon icon="times-circle bg-white rounded-circle" size=2x />
      </a>
    </div>
    <mdb-icon v-if="!value" far icon="image tx-center tx-gray-500" size=8x />
    <mdb-icon v-if="!value" icon="upload tx-center pos-relative tx-gray-300 b-50" size="4x" />
    <div v-if="!value" class="pos-relative b-45 tx-center tx-bold tx-gray-500">Maksimal <b class="tx-pink">{{ maxSize }} MB</b></div>
    <input
      :id="randomId"
      :disabled="disabled"
      type="file"
      class="d-none"
      accept=".png,.jpg,.jpeg"
      @change="$e => handleFile($e.target.files)"
    >
  </label>
</template>
<style scoped>
  .base-image {
    cursor: pointer !important;
  }
  .base-image.disabled {
    border: 2px dashed #97a3b9;
  }
  .base-image:not(.disabled) {
    border: 2px dashed #e31f52;
  }
  .close-hover:hover {
    opacity: 0.7;
  }
</style>
<script lang="ts">
import { Component, Mixins, Prop, Emit } from 'vue-property-decorator'
import { mdbIcon } from 'mdbvue'
import swal from '../../mixins/swal.vue'
import { Dictionary } from 'node_modules/vue-router/types/router'

@Component({
  components: { mdbIcon }
})
export default class ImageUploadSingle extends Mixins(swal) {
  @Prop({ default: 5 }) readonly maxSize!: number
  @Prop() readonly value!: string | File
  @Prop() readonly disabled!: boolean
  @Prop() readonly addClass!: string
  @Prop({ default: false }) readonly noClose!: boolean

  private classer = 'base-image card wd-150 ht-150 mg-x-auto bg-gray-100 rounded-5'

  get image (): string {
    if (typeof (this.value) !== 'string') {
      return URL.createObjectURL(this.value)
    }

    return this.value
  }

  get imageLayer (): Dictionary<string> {
    const style = {
      'background-size': 'cover',
      'background-position': '50%',
      border: '1px solid #e31f52'
    }

    if (this.value) {
      Object.assign(style, {
        'background-image': `url(${this.image})`
      })
    }

    return style
  }

  get randomId (): string {
    return Math.random().toString(36).slice(2)
  }

  @Emit('input')
  emitting (value: File): File {
    return value
  }

  handleFile (files: FileList): void {
    if (files.length) {
      const fileSize = files[0].size / 1024 / 1000
      if (fileSize <= this.maxSize) {
        this.emitting(files[0])
      } else {
        this.topedToast(`${files[0].name} melebihi ukuran maksimal.`, 'OK')
      }
    }
  }
}
</script>
