<template>
  <div class="badge badge-warning tx-12">
    <i class="fas fa-clock"></i> {{ time | date(format) }}
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import date from '../../filters/date'

@Component({
  filters: {
    date
  }
})
class TimeBadge extends Vue {
  @Prop({ default: new Date().getTime() }) readonly time !: number
  @Prop({ default: 'DD MN YY, HH:mm:ss' }) readonly format!: string
}

export default TimeBadge
</script>
