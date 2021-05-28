<template>
  <mdb-modal
    :id="idModal"
    centered
    scrollable
    :size="size"
    :show="value"
    @close="$emit('input', false)"
  >
    <mdb-modal-header class="bd-0">
      <h5 class="tx-bold wd-100p mb-0">{{ headerText }}</h5>
    </mdb-modal-header>
    <mdb-modal-body class="pt-0 pos-relative">
      <slot></slot>
    </mdb-modal-body>
    <slot name="footer"></slot>
  </mdb-modal>
</template>
<style>
  #eb-modal-center div .modal-content {
    border-radius: 10px;
  }
  @media(max-width: 768px) {
    #eb-modal-center .modal-dialog {
      margin: 0;
      max-width: 768px;
      max-height: 100%;
    }
    #eb-modal-center div .modal-content {
      position: absolute;
      top: 0;
      border-radius: 0;
      height: 100% !important;
    }
  }
</style>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { mdbModal, mdbModalHeader, mdbModalBody } from 'mdbvue'

@Component({
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalBody
  }
})
class ModalCenter extends Vue {
  @Prop({ default: false }) readonly value!: boolean
  @Prop({ default: '' }) readonly headerText!: string
  @Prop({ default: 'md' }) readonly size!: string
  @Prop({ default: false }) readonly toBasic!: boolean

  get idModal (): string {
    if (this.toBasic) {
      return ''
    }

    return 'eb-modal-center'
  }
}

export default ModalCenter
</script>
