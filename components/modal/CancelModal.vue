<template>
  <modal-center header-text="Batalkan Pesanan" class="tx-center" :value="show" @input="close()">
    <p class="mb-1">Beri alasan untuk membatalkan pesanan</p>
    <p class="tx-13">Anda dapat memilih alasan yang tersedia di bawah atau melakukan kustomisasi alasan dengan memilih opsi "Lainnya"</p>

    <div v-if="reasonList.length" class="tx-left bd rounded-10 p-3">
      <label v-for="(reason, key) in reasonList" :key="key" class="rdiobox">
        <input v-model="text" type="radio" :value="reason">
        <span>{{ reason }}</span>
      </label>
      <label class="rdiobox">
        <input v-model="text" type="radio" value="" @change="anotherText = ''">
        <span>Lainnya</span>
        <div v-if="!text" class="mt-2">
          <input v-model="anotherText" class="form-control" placeholder="Tulis alasan lainnya">
        </div>
      </label>
    </div>
    <input v-else v-model="text" class="form-control" placeholder="Tulis alasan pembatalan">

    <div class="mt-3">
      <button class="btn btn-outline-info rounded-5" @click="close()">Batal</button>
      <button v-if="text || anotherText" class="btn btn-info rounded-5 ml-3" :disabled="updateLoading" @click="cancel()">
        <div v-if="updateLoading" class="spinner-border spinner-border-sm" /> Batalkan Pesanan
      </button>
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

  @Emit('close')
  close (): void {
    console.log('close odal')
  }

  updateLoading = false
  reasonList = ['Produk tidak sesuai', 'Produk kosong', 'Ingin merubah pesanan', 'Kendala pengiriman', 'Penjual tidak merespon']
  text = ''
  anotherText = ''
  async cancel (): Promise<void> {
    this.updateLoading = true

    const order = this.order
    if (!order) {
      return order
    }

    const reason = this.text || this.anotherText

    try {
      await this.oncancel(reason)

      this.updateLoading = false
      this.topedToast('Pesanan berhasil dibatalkan', 'OK')

      this.close()
    } catch {
      this.updateLoading = false
      this.topedToast('Pesanan gagal dibatalkan', 'OK')
      this.close()
    }
  }
}
</script>
