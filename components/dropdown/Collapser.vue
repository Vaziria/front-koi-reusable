<template>
  <div class="card-body bd-b pos-relative p-0">
    <mdb-collapse toggleTag="a" :togglers="2" toggleClass="toggler d-block wd-100p pos-relative z-index-10 tx-bold p-3" :toggleText="[text]">
      <i class="fas fa-angle-up pos-absolute t-20 r-20 bg-white z-index-10"></i>
      <slot></slot>
    </mdb-collapse>
    <i class="fas fa-angle-down pos-absolute t-20 r-20"></i>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mdbCollapse } from 'mdbvue'

@Component({
  components: {
    mdbCollapse
  }
})
class Collapser extends Vue {
  @Prop({ default: '' }) readonly text!: string

  mounted (): void {
    const toggler = this.$el.querySelector('.toggler') as HTMLDivElement
    toggler.click()
  }
}

export default Collapser
</script>
