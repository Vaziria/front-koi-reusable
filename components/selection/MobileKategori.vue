<template>
  <div>
    <FilterBadge
      v-for="cat in showKategories"
      :key="cat.kategori"
      :text="cat.kategori"
      :active="cat.active"
      class="text-capitalize"
      @click="onSelect(cat.kategori)"
    />

    <ModalCenter
      v-model="showModal"
      header-text="Kategori"
      :to-basic="true"
    >
      <div class="list-group">
        <MobileRadio
          v-for="cat in kategoriesActive"
          :key="cat.kategori"
          :text="cat.kategori"
          :active="cat.active"
          class="bd-t-0"
          @click="onSelect(cat.kategori)"
        />
      </div>
    </ModalCenter>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import FilterBadge from '../badge/FilterBadge.vue'
import ModalCenter from '../modal/ModalCenter.vue'
import MobileRadio from '../form/MobileRadio.vue'
import { categByLetter } from '../../constant/kategori'

type SelectKategori = {
  kategori: string
  active: boolean
}

@Component({
  components: {
    FilterBadge,
    ModalCenter,
    MobileRadio
  }
})
class MobileKategori extends Vue {
  @Prop({ default: () => [] }) readonly value!: string[]

  showModal = false

  get showKategories (): SelectKategori[] {
    const kategoris: SelectKategori[] = []

    if (this.value.length) {
      this.value.forEach(kategori => {
        kategoris.push({
          kategori,
          active: true
        })
      })
    }

    categByLetter.forEach(kategori => {
      const maxShow = kategoris.length < 5
      if (maxShow && !this.value.includes(kategori)) {
        kategoris.push({
          kategori,
          active: false
        })
      }
    })

    return kategoris
      .sort((current, next) => {
        if (current.kategori < next.kategori) return -1
        if (current.kategori > next.kategori) return 1
        return 0
      })
  }

  get kategoriesActive (): SelectKategori[] {
    return categByLetter.map(kategori => {
      const active = this.value.includes(kategori)
      return {
        kategori,
        active
      }
    })
  }

  openModal (): void {
    this.showModal = true
  }

  @Emit('input')
  onInput (kategori: string): string[] {
    if (this.value.includes(kategori)) {
      return this.value
        .filter(cat => cat !== kategori)
    }

    return [...this.value, kategori]
  }

  @Emit('select')
  onSelect (kategori: string): string {
    this.showModal = false
    this.onInput(kategori)

    if (this.value.includes(kategori)) {
      return ''
    }
    return kategori
  }
}

export default MobileKategori

</script>
