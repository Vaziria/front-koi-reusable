import { shallowMount, createWrapper } from '@vue/test-utils'
import DiskusiForm from './DiskusiForm.vue'
import { MockWrapper } from '../../mock/types'
import store from '../../mock/store'

let wrapper: MockWrapper<DiskusiForm>

describe('DiskusiForm.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount<DiskusiForm>(DiskusiForm, {
      propsData: {
        replyid: 'test'
      },
      store
    })
  })

  it('check emit event focus', async () => {
    expect(wrapper.vm.onFocus(true))
      .toBe(true)

    const emitFocus = wrapper.emitted('focus') || [[]]
    expect(emitFocus[0][0])
      .toBe(true)
  })

  it('check emit event focusout', async () => {
    expect(wrapper.vm.onFocus(false))
      .toBe(false)

    const emitFocus = wrapper.emitted('focus') || [[]]
    expect(emitFocus[0][0])
      .toBe(false)
  })

  it('check emit event reset', async () => {
    wrapper.vm.resetFocus()

    const emitReset = wrapper.emitted('reset') || [[]]
    expect(emitReset)
      .not
      .toBeUndefined()
  })

  it('check on send reply', async () => {
    const rootWrapper = createWrapper(wrapper.vm.$root)
    wrapper.vm.sendReply()

    const rootEmitShowReply = rootWrapper.emitted('showReply') || [[]]
    expect(rootEmitShowReply[0][0].replyid)
      .toBe('test')

    const emitReset = wrapper.emitted('reset') || [[]]
    expect(emitReset)
      .not
      .toBeUndefined()
  })
})
