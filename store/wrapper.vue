<script lang="ts">
import { Vue } from 'vue-property-decorator'

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export default class VueWithStore<StoreType> extends Vue {
  get tstore (): StoreType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wdw = window as any

    // console.log('store', store)
    return wdw.store as StoreType
  }

  getStore (): StoreType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = this.$store as any

    // console.log('store', store)
    return store as StoreType
  }
}
</script>
