<template>
  <ModalCenter
    class="modal-delete tx-center"
    :value="value"
    :headerText="headerText"
    :to-basic="true"
    size="sm"
    @input="val => $emit('input', val)"
  >
    <mdb-icon icon="trash-alt" size=5x class="mb-2 tx-gray-400 d-block" />
    <p v-if="typeof name === 'string'" class="tx-gray-600 tx-12 tx-md-14 mb-2">{{ name }}</p>
    <ul v-else class="list-group tx-gray-600 tx-12 tx-md-13 mb-2" style="overflow-y: scroll; max-height: 145px;">
      <li v-for="nm in name" :key="nm" class="list-group-item py-2">{{ nm }}</li>
    </ul>
    <p class="tx-13 tx-gray-600"><mdb-icon icon="exclamation-triangle" /> penghapusan item bersifat permanen</p>
    <button class="btn btn-outline-info tx-bold rounded-5 mr-3" @click="$emit('input', false)">Batalkan</button>
    <button class="btn btn-info tx-bold rounded-5" @click="$emit('action')">Hapus</button>
  </ModalCenter>
</template>
<style>
  .modal-delete div {
    min-width: 350px;
  }
  .modal-delete div .modal-content .modal-header h5{
    font-size: 25px;
  }
  .modal-delete div .modal-content .modal-header a{
    display: none;
  }
</style>
<script>

import { mdbIcon } from 'mdbvue'
import ModalCenter from './ModalCenter'

export default {
  name: 'ModalDelete',
  components: {
    mdbIcon,
    ModalCenter
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    headerText: {
      type: String,
      default: 'Hapus'
    },
    name: {
      type: [String, Array],
      default: ''
    }
  }
}
</script>
