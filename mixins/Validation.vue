<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

const ruleEmail = /\S+@\S+\.\S+/

@Component
class ValidationMixin extends Vue {
  stringValid (string: string, length = 1): boolean {
    return string.length >= length
  }

  numberValid (number: number): boolean {
    return number >= 0
  }

  arrayValid<T> (array: T[], length = 1): boolean {
    return array.length >= length
  }

  phoneValid (phone: string): boolean {
    return phone.length >= 12
  }

  emailValid (email: string): boolean {
    return email.length > 0 && ruleEmail.test(email)
  }
}

export default ValidationMixin
</script>
