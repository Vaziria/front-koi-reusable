import { Wrapper } from '@vue/test-utils'
import { MockStore } from './store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockWrapper<VueClass extends Vue> = Wrapper<VueClass & { [key: string]: any }>
type MockCommit = jest.Mock & MockStore['commit']
type MockDispatch = jest.Mock & MockStore['dispatch']

export {
  MockWrapper,
  MockStore,
  MockCommit,
  MockDispatch
}
