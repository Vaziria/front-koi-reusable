<script lang="ts">
import { Component } from 'vue-property-decorator'
import { IUserState, UserAction, UserMutation } from '../store/user'
import { Namespaced, Store } from '../store/types'
import WithStore from '../store/wrapper.vue'
import { Tasker, TSnapshot } from '../api/storage'

type State = {
  'user': IUserState
}

type StorageStore = Store<State, Namespaced<UserMutation, 'user'>, Namespaced<UserAction, 'user'>>

@Component
export default class VueWithStore extends WithStore<StorageStore> {
  get shopid (): string {
    return this.tstore.state.user.shopid
  }

  async uploadProductImage (file: File, snapshot?: TSnapshot): Promise<string> {
    const task = new Tasker({
      file,
      snapshot,
      path: `/product/image/${this.shopid}`
    })
    return task.stateChanged()
  }

  async uploadProductVideo (file: File, snapshot?: TSnapshot): Promise<string> {
    const task = new Tasker({
      file,
      snapshot,
      path: `/product/video/${this.shopid}`
    })
    return task.stateChanged()
  }

  async uploadProductThumbnail (file: File, snapshot?: TSnapshot): Promise<string> {
    const task = new Tasker({
      file,
      snapshot,
      path: `/thumbnail/${this.shopid}`
    })
    return task.stateChanged()
  }
}
</script>
