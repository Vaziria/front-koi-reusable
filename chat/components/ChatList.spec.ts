import { shallowMount } from '@vue/test-utils'
import ChatList from './ChatList.vue'
import ContactList from './contacts/ContactList.vue'
import { single as singleContact } from '../../mock/chat/contact'
import { single as singleChat } from '../../mock/chat/chat'
import store, { MockStore } from '../../mock/store'
import { MockWrapper } from '../../mock/types'
import { UserChat } from '../../model/chat'

const addUser = singleContact()

let wrapper: MockWrapper<ChatList>
let mockStore: MockStore
let mockCommit: jest.Mock & MockStore['commit']
let userlist: UserChat[]

describe('ChatList.vue', () => {
  beforeEach(() => {
    store.commit('user/set_access', {
      shopid: 'shopid',
      role: ['seller']
    })
    wrapper = shallowMount<ChatList>(ChatList, {
      store
    })

    mockStore = wrapper.vm.$store
    mockCommit = jest.fn(mockStore.commit)
  })

  it('test ketika user baru ditambahkan', () => {
    mockCommit('chat/push_user_list', addUser)
    userlist = wrapper.vm.userlist
    const findAddedUser = userlist
      .find(user => user.id === addUser.id)

    expect(mockCommit.mock.calls[0][0])
      .toEqual('chat/push_user_list')

    expect(findAddedUser)
      .not
      .toBeUndefined()
  })

  it('test ketika user sudah ada ditambahkan', () => {
    const lastChat = singleChat()
    addUser.unread += 1
    addUser.last_msg = lastChat
    mockCommit('chat/update_user_list', addUser)

    userlist = wrapper.vm.userlist
    const indexUpdateUser = userlist
      .findIndex(user => user.id === addUser.id)
    const findUpdatedUser = userlist
      .find(user => user.id === addUser.id)

    expect(mockCommit.mock.calls[0][0])
      .toEqual('chat/update_user_list')

    // check update contact diindex pertama
    expect(indexUpdateUser)
      .toEqual(0)

    // check count bertambah
    expect(findUpdatedUser?.unread)
      .toEqual(addUser.unread)

    // check last chat berubah
    expect(findUpdatedUser?.last_msg.text)
      .toEqual(lastChat.text)
  })

  it('test ketika contact diklik', () => {
    userlist = wrapper.vm.userlist
    const firstContactComponent = wrapper.findComponent(ContactList)

    const contactClick = jest.fn(() => {
      mockCommit('chat/update_user_list', {
        ...userlist[0],
        unread: 0
      })
      mockCommit('chat/set_user', userlist[0])

      userlist = wrapper.vm.userlist
      firstContactComponent.trigger('click')
    })

    contactClick()
    expect(contactClick)
      .toBeCalled()

    // check contact unread reset
    expect(userlist[0].unread)
      .toEqual(0)

    // check active contact user
    expect(wrapper.vm.activeUser.id)
      .toEqual(userlist[0].id)
  })
})
