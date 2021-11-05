import { shallowMount } from '@vue/test-utils'
import ChatBox from './ChatBox.vue'
import { single as singleContact } from '../../mock/chat/contact'
import { single as singleChat } from '../../mock/chat/chat'
import store, { MockStore } from '../../mock/store'
import { MockWrapper } from '../../mock/types'
import { ChatUI } from '../../model/chat'

let wrapper: MockWrapper<ChatBox>
let mockStore: MockStore
let mockCommit: jest.Mock & MockStore['commit']
let messages: ChatUI[]
let pushNewMsg: jest.Mock<void, [msg: ChatUI]>

const contactActive = singleContact()

describe('ChatBox.vue', () => {
  beforeEach(() => {
    store.commit('user/set_access', {
      shopid: 'shopid',
      role: ['seller']
    })

    store.commit('chat/set_user', contactActive)

    wrapper = shallowMount<ChatBox>(ChatBox, {
      store
    })

    messages = wrapper.vm.messages
    mockStore = wrapper.vm.$store
    mockCommit = jest.fn(mockStore.commit)

    pushNewMsg = jest.fn((msg: ChatUI) => {
      if (msg.send_error) {
        mockCommit('chat/push_message_error', msg)
      } else if (msg.send_process) {
        mockCommit('chat/push_message_unsend', msg)
      } else {
        wrapper.vm.messages = [msg, ...wrapper.vm.messages]
        messages = wrapper.vm.messages
      }
    })
  })

  it('test ketika ada chat baru masuk', () => {
    const newMsg = singleChat()
    pushNewMsg(newMsg)
    expect(messages[0].id)
      .toEqual(newMsg.id)
  })

  it('test ketika ada chat unsend', () => {
    const unsendMsg = singleChat()
    unsendMsg.to_id = contactActive.id
    unsendMsg.send_process = true
    pushNewMsg(unsendMsg)

    const findErrorMsg = wrapper.vm.unsendMessages
      .find((msg: ChatUI) => msg.id === unsendMsg.id)

    expect(findErrorMsg)
      .not
      .toBeUndefined()
  })

  it('test ketika ada chat error', () => {
    const errMsg = singleChat()
    errMsg.to_id = contactActive.id
    errMsg.send_error = true
    pushNewMsg(errMsg)

    const findErrorMsg = wrapper.vm.errorMessages
      .find((msg: ChatUI) => msg.id === errMsg.id)

    expect(findErrorMsg)
      .not
      .toBeUndefined()
  })
})
