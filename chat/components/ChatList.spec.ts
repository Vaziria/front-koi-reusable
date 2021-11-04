import { shallowMount, Wrapper } from '@vue/test-utils'
import ChatList from './ChatList.vue'
import { single } from '../../mock/chat/contact'
import store from '../../mock/store'
import { firestore } from '../../mock/firebase'

const ChatLists = new ChatList()
const contact = single()

let component: Wrapper<typeof ChatLists>

describe('ChatList.vue', () => {
  beforeEach(() => {
    component = shallowMount<ChatList>(ChatList, {
      propsData: {
        contact
      },
      store,
      mounted () {
        console.log('mouted is good')
      }
    })
  })

  it('test', () => {
    expect(component.element).toMatchSnapshot()
  })
})
