<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
@Component
export default class VueWithStore<StoreType> extends Vue {
  get tstore (): StoreType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = this.$store as any

    // console.log('store', store)
    return store as StoreType
  }

  getStore (): StoreType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = this.$store as any

    // console.log('store', store)
    return store as StoreType
  }
}
</script>
