<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import firebase from 'firebase'

@Component
export default class Loading extends Vue {
  async loadingwait (callback: Promise<void>): Promise<void> {
    // not implemented root emit belum di typing harus di typing setelah ngaggur
    this.$root.$emit('pageloading', true)
    try {
      await callback
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.log(e)
    }
    this.$root.$emit('pageloading', false)
  }

  setprogress (snapshot: firebase.storage.UploadTaskSnapshot): void {
    const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    this.$root.$emit('pageprogress', { show: true, value: percent, text: `mengunggah ${snapshot.ref.fullPath}` })
  }
}
</script>
// export default {
//   methods: {
//     loadingwait,
//     setprogress
//   }
// }
