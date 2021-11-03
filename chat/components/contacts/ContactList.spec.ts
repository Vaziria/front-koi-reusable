import { shallowMount, Wrapper } from '@vue/test-utils'
import ContactList from './ContactList.vue'
import { single } from '../../../mock/chat/contact'
import store, { MockStore } from '../../../mock/store'

describe('ContactList.vue', () => {
  const ContactLists = new ContactList()
  let component: Wrapper<typeof ContactLists>
  // let compStore: MockStore
  const contact = single()

  beforeEach(() => {
    component = shallowMount<ContactList>(ContactList, {
      propsData: {
        contact
      },
      store
    })
    // compStore = component.vm.$store
  })

  it('test contact unread ditampilkan', () => {
    expect(component.vm.$el.querySelector('.az-img-user span')?.innerHTML)
      .toEqual(contact.unread.toString())
  })

  // it('test contact unread ditampilkan', () => {
  //   expect(component.vm.$el.querySelector('.az-img-user span')?.innerHTML)
  //     .toEqual(contact.unread.toString())
  // })

  // it('test contact unread ditampilkan', () => {
  //   compStore.commit('system/setIsSeller', false)
  //   const compBadge = component.vm.$el.querySelector('.badge.badge-info')
  //   console.log('isSeller', compStore.state.system.isSeller, compBadge)
  //   // store.commit('system/setIsSeller', false)
  //   expect(compBadge)
  //     .toBeUndefined()
  // })

  // it('test contact unread disembunyikan', () => {
  //   compStore.commit('system/setIsSeller', false)
  //   const compBadge = component.vm.$el.querySelector('.badge.badge-info')
  //   console.log('isSeller', compStore.state.system.isSeller, compBadge)
  //   expect(compBadge)
  //     .toBeUndefined()
  // })

  // it('test badge penjual ditampilkan', () => {
  //   component.vm.$data.isSeller = false
  //   expect(component.vm.$el.querySelector('badge badge-info')?.innerHTML)
  //     .not
  //     .toBe(undefined)
  // })

  // it('stuktur html yang diharapkan', () => {
  //   expect(component.element).toMatchSnapshot()
  // })
})
