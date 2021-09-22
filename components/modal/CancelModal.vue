<template>
  <modal-center
    :header-text="headerText"
    class="tx-center tx-13"
    :value="show"
    @input="close()"
  >
    <p class="mb-1">Beri alasan untuk membatalkan pesanan</p>
    <p>Anda dapat memilih alasan yang tersedia di bawah atau melakukan kustomisasi alasan dengan memilih opsi "Lainnya"</p>

    <div v-if="reasonList.length" class="tx-left bd rounded-10 p-3">
      <label v-for="(reason, key) in reasonList" :key="key" class="rdiobox">
        <input v-model="text" type="radio" :value="reason">
        <span>{{ reason }}</span>
      </label>
      <label class="rdiobox">
        <input v-model="text" type="radio" value="" @change="anotherText = ''">
        <span>Lainnya</span>
        <div v-if="!text" class="mt-2">
          <input v-model="anotherText" class="form-control rounded-5 tx-13" placeholder="Tulis alasan lainnya">
        </div>
      </label>
    </div>
    <input v-else v-model="text" class="form-control rounded-5" placeholder="Tulis alasan pembatalan">

    <div slot="footer" class="px-3 pb-3 d-flex">
      <div class="mr-3 wd-50p">
        <button
          class="btn btn-outline-info btn-block rounded-5 tx-bold"
          @click="close()"
        >
          Tutup
        </button>
      </div>
      <div class="wd-50p">
        <button
          class="btn btn-info btn-block rounded-5 tx-bold"
          :disabled="!(text || anotherText) || updateLoading"
          @click="cancel()"
        >
          {{ headerText }}
        </button>
      </div>
    </div>
  </modal-center>
</template>
<style scoped>
  input[type=radio]:checked + span + div {
    display: block !important;
  }
</style>
<script lang="ts">
import { Component, Mixins, Prop, Emit } from 'vue-property-decorator'
import swal from '../../mixins/swal.vue'
import ModalCenter from './ModalCenter.vue'
import { Order } from '../../model/order'

const defaultReason = ['Produk tidak sesuai', 'Produk kosong', 'Ingin merubah pesanan', 'Kendala pengiriman', 'Penjual tidak merespon']

@Component({
  components: {
    ModalCenter
  }
})
export default class CancelModal extends Mixins(swal) {
  @Prop({ default: false }) readonly show!: boolean
  @Prop({}) readonly order!: Order
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
  @Prop({ default: async (data: string) => {} }) readonly oncancel!: (data: string) => Promise<any>
  @Prop({ default: () => defaultReason }) readonly reasonList!: string[]

  @Emit('close')
  close (): void {
    return undefined
  }

  updateLoading = false
  text = ''
  anotherText = ''

  get headerText (): string {
    if (this.order.status === 'waitverif') {
      return 'Batalkan Pesanan'
    }

    return 'Ajukan Pembatalan'
  }

  async cancel (): Promise<void> {
    const order = this.order
    if (!order) {
      return order
    }

    const reason = this.text || this.anotherText
    await this.oncancel(reason)
  }
}
</script>
