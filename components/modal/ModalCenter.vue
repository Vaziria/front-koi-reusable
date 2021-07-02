<template>
  <mdb-modal
    :id="idModal"
    :centered="true"
    :scrollable="true"
    :size="size"
    :show="value"
    @close="$emit('input', false)"
  >
    <mdb-modal-header class="bd-0" :close="closeIcon">
      <h5 class="tx-bold wd-100p mb-0">{{ headerText }}</h5>
    </mdb-modal-header>
    <mdb-modal-body class="pt-0 px-3 pos-relative">
      <slot></slot>
    </mdb-modal-body>
    <slot name="footer"></slot>
  </mdb-modal>
</template>
<style>
  #eb-modal-center div .modal-content {
    border-radius: 10px;
  }
  #eb-halfmodal .modal-dialog {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 768px;
    height: 100% !important;
  }
  #eb-halfmodal div .modal-content {
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    position: absolute;
    bottom: -16px;
    width: 100%;
    /*height: 50vh !important;*/
    max-height: 100% !important;
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
  @Prop({ default: false }) readonly half!: boolean
  @Prop({ default: true }) readonly closeIcon!: boolean

  get idModal (): string {
    if (this.toBasic) {
      return ''
    }

    if (this.half) {
      return 'eb-halfmodal'
    }

    return 'eb-modal-center'
  }
}

export default ModalCenter
</script>
