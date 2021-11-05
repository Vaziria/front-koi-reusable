import { shallowMount } from '@vue/test-utils'
import ContactList from './ContactList.vue'
import { single } from '../../../mock/chat/contact'
import store from '../../../mock/store'
import { MockWrapper } from '../../../mock/types'

const contact = single()

let wrapper: MockWrapper<ContactList>

describe('ContactList.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount<ContactList>(ContactList, {
      propsData: {
        contact
      },
      store
    })
  })

  it('test contact unread ditampilkan', () => {
    expect(wrapper.vm.$el.querySelector('.az-img-user span')?.innerHTML)
      .toEqual(contact.unread.toString())
  })

  it('test contact unread disembunyikan', async () => {
    await wrapper.setProps({
      contact: {
        ...contact,
        unread: 0
      }
    })
    expect(wrapper.vm.$el.querySelector('.az-img-user span')?.innerHTML)
      .toBeUndefined()
  })
})
