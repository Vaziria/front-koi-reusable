<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { FixLocation } from './navigator'

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
}
</script>
