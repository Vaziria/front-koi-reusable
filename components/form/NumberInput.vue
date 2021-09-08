<template>
  <input
    v-model="inputVal"
    v-thousand
    pattern="[0-9]*"
    inputmode="numeric"
    @wheel.prevent
    @keyup.prevent
    @keyup.prevent.enter="onKeyenter"
    @keypress.101.prevent
    @keypress.45.prevent
    @keypress.43.prevent
    @input="onInput"
    @blur="onBlur"
  >
</template>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input {
  -moz-appearance: textfield;
}
</style>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'

function thousand (el: HTMLInputElement): void {
  const rule = /\B(?=(\d{3})+(?!\d))/g
  const valNumber = Math.abs(parseInt(el.value)) || 0
  el.value = valNumber.toString().replace(rule, '.')
}

type strint = string|number

@Component({
  directives: {
    thousand: {
      bind: (el) => thousand(el as HTMLInputElement),
      update: (el) => thousand(el as HTMLInputElement)
    }
  }
})
class NumberInput extends Vue {
  @Prop() readonly max!: number
  @Prop({ default: 0 }) readonly min!: strint
  @Prop({ default: 0 }) readonly value!: strint

  inputVal: strint = this.value

  @Watch('value')
  valueChanged (value: strint): void {
    this.inputVal = value
  }

  @Watch('inputVal')
  inputValChanged (value: strint): void {
    const lowerThantMin = value < this.min
    const greaterThanMax = this.max && value > this.max

    if (!lowerThantMin && !greaterThanMax) {
      this.input(value)
    }

    if (lowerThantMin) {
      this.inputVal = this.min
    }

    if (greaterThanMax) {
      this.inputVal = this.max
    }
  }

  eventHandler (el: Event): number {
    const element = el.target as HTMLInputElement
    const value = element.value + ''
    const removeDot = (value).replace(/\./g, '')
    const forceNum = Math.abs(parseInt(removeDot))

    if (!forceNum) {
      return 0
    }

    return forceNum
  }

  @Emit('input')
  input (num: strint): number {
    if (typeof num === 'string') {
      return parseInt(num)
    }
    return num | 0
  }

  @Emit('input')
  onInput (el: Event): number {
    return this.eventHandler(el)
  }

  @Emit('blur')
  onBlur (el: Event): number {
    return this.eventHandler(el)
  }

  @Emit('keyenter')
  onKeyenter (el: Event): number {
    return this.eventHandler(el)
  }
}
export default NumberInput
</script>
