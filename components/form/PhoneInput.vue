<template>
  <div>
    <input
      ref="phoneInput"
      :value="validValue"
      maxlength="22"
      class="form-control rounded-5"
      @input="$e => phoneValidating($e.target.value)"
    >
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
class PhoneInput extends Vue {
  @Prop() readonly value!: string

  phone = this.value

  get validValue (): string {
    let { value } = this
    if (value[0] === '0') {
      value = value.substring(1)
    }

    const checkState = ['+62', '(+62)']
    if (checkState.find(state => this.value.includes(state))) {
      value = value
        .replace('+62', '')
        .replace('(+62)', '')
    }

    return this.setPhoneFormat(value)
  }

  setPhoneFormat (phone: string): string {
    let phoneText = '(+62)'
    const firstNum = phone.substring(0, 3)
    const middleNum = phone.substring(3, 7)
    const lastNum = phone.substring(7, 11)
    const extraNum = phone.substring(11, 14)
    const allNum = [firstNum, middleNum, lastNum, extraNum]

    allNum.forEach(num => {
      if (num) {
        phoneText += ' ' + num
      }
    })

    return phoneText
  }

  phoneValidating (phone: string): void {
    const inputRef = this.$refs.phoneInput as HTMLInputElement
    const splitMatch = phone
      .replace('(+62', '')
      .match(/\d/g) || []
    phone = splitMatch.join('')

    if (phone[0] === '0') {
      phone = phone.substring(1)
    }

    inputRef.value = this.setPhoneFormat(phone)

    this.onInput(phone.substring(0, 14))
  }

  @Emit('input')
  onInput (text: string): string {
    return '+62' + text
  }
}

export default PhoneInput
</script>
