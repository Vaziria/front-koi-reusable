<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Navigator, FixLocation } from './navigator'

@Component
export default class WithNav<RouteType> extends Vue {
  currentRoute<K extends keyof RouteType> (): RouteType[K] & FixLocation & { name: K } {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.$route as any
  }

  get currentName (): keyof RouteType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.$route.name as any
  }

  get navigation (): Navigator<RouteType> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this as any).$navigation as any
  }
}
</script>
