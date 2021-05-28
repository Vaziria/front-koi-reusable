import { Vue } from 'vue-property-decorator'
import { Store } from 'vuex/types/index'

export abstract class VueWithStore<StoreType extends Store<any>> extends Vue {
    get tstore (): StoreType {
        return this.$store as StoreType
    }
}


