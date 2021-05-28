import { Vue } from 'vue-property-decorator'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class VueWithStore<StoreType> extends Vue {
  get tstore (): StoreType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store: any = this.$store
    return store as StoreType
  }
}
