<template>
  <div class="badge badge-warning tx-12">
    <i class="fas fa-clock"></i> {{ time | moment }}
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import moment from '../../filters/moment'

@Component({
  filters: {
    moment
  }
})
class TimeBadge extends Vue {
  @Prop({ default: new Date().getTime() }) readonly time !: number
}

export default TimeBadge
</script>
