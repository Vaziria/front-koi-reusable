<script lang="ts">
import { Component } from 'vue-property-decorator'
import firebase from 'firebase'
import WithRootEmit from '../event/WithRootEmit.vue'
import { BasicRootEvent } from '../event/basicRootEvent'

@Component
class RootEmitMix extends WithRootEmit<BasicRootEvent> {}

@Component
export default class Loading extends RootEmitMix {
  async loadingwait (callback: Promise<void>): Promise<void> {
    // not implemented root emit belum di typing harus di typing setelah ngaggur
    this.rootEmit('pageloading', {
      text: '',
      show: true
    })
    try {
      await callback
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.log(e)
    }
    this.rootEmit('pageloading', {
      text: '',
      show: false
    })
  }

  setprogress (snapshot: firebase.storage.UploadTaskSnapshot): void {
    const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    this.rootEmit('pageloading', {
      text: `mengunggah ${snapshot.ref.fullPath} - ${percent}%`,
      show: true
    })
  }
}
</script>
