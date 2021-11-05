import { shallowMount } from '@vue/test-utils'
import ChatForm from './ChatForm.vue'
import store from '../../mock/store'
import { MockWrapper } from '../../mock/types'

let wrapper: MockWrapper<ChatForm>
let sendMessage: jest.Mock<boolean>
let setText: (text: string) => void

describe('ChatForm.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount<ChatForm>(ChatForm, {
      store
    })

    sendMessage = jest.fn(() => {
      return !!wrapper.vm.text
    })
    setText = (text: string) => {
      wrapper.vm.text = text
    }

    wrapper.vm.sendMessage = sendMessage
  })

  it('test send chat', () => {
    setText('test')
    wrapper.vm.sendMessage()

    expect(sendMessage).toBeCalled()
    expect(sendMessage.mock.results[0].value).toBe(true)
  })

  it('test send chat ketika text kosong', () => {
    wrapper.vm.sendMessage()

    expect(sendMessage).toBeCalled()
    expect(sendMessage.mock.results[0].value).toBe(false)
  })
})
