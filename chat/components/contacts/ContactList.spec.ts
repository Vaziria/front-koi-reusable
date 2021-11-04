import { shallowMount, Wrapper } from '@vue/test-utils'
import ContactList from './ContactList.vue'
import { single } from '../../../mock/chat/contact'
import store from '../../../mock/store'

const ContactLists = new ContactList()
const contact = single()

let component: Wrapper<typeof ContactLists>

describe('ContactList.vue', () => {
  beforeEach(() => {
    component = shallowMount<ContactList>(ContactList, {
      propsData: {
        contact
      },
      store
    })
  })

  it('test contact unread ditampilkan', () => {
    expect(component.vm.$el.querySelector('.az-img-user span')?.innerHTML)
      .toEqual(contact.unread.toString())
  })

  it('test contact unread disembunyikan', async () => {
    await component.setProps({
      contact: {
        ...contact,
        unread: 0
      }
    })
    expect(component.vm.$el.querySelector('.az-img-user span')?.innerHTML)
      .toBeUndefined()
  })
})
