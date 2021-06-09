<template>
  <div>
    <input
      :value="validValue"
      class="form-control rounded-5"
      maxlength="22"
      @input="$e => phoneValidate($e.target)"
    >
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

@Component
class PhoneInput extends Vue {
  @Prop() readonly value!: string

  get validValue (): string {
    let phone = this.value
      .replace('+62', '')

    if (phone[0] === '0') {
      phone = phone.substring(0)
    }

    return this.formatedPhone(phone)
  }

  formatedPhone (phone: string): string {
    let formatedNum = '(+62)'
    const firstNum = phone.slice(0, 3)
    const middleNum = phone.slice(3, 7)
    const lastNum = phone.slice(7, 11)
    const extraNum = phone.slice(11, 14)
    const allNum = [firstNum, middleNum, lastNum, extraNum]

    allNum.forEach(num => {
      if (num) {
        formatedNum += ' ' + num
      }
    })

    return formatedNum
  }

  @Emit('input')
  phoneValidate (input: HTMLInputElement): string {
    let phone = input.value
      .replace('+62', '')
      .replace('(+62)', '')
    const numMatch = phone.match(/\d+/) || []
    phone = numMatch.join('')

    if (phone[0] === '0') {
      phone = phone.substring(0)
    }

    input.value = this.formatedPhone(phone)

    return '+62' + phone.slice(0, 14)
  }
}

export default PhoneInput
</script>
