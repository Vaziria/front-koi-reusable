import { Wrapper } from '@vue/test-utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MockWrapper<VueClass extends Vue> = Wrapper<VueClass & { [key: string]: any }>
