<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback<ParamType> = (f: ParamType) => any

@Component
export default class WithRootEmit<EventType> extends Vue {
  rootEmit<K extends keyof EventType> (key: K, data: EventType[K]): void {
    this.$root.$emit(key as string, data)
  }

  rootOn<K extends keyof EventType> (key: K, callback: Callback<EventType[K]>): void {
    this.$root.$on(key as string, callback)
  }

  rootOff<K extends keyof EventType> (key: K, callback: Callback<EventType[K]>): void {
    this.$root.$off(key as string, callback)
  }
}

</script>
