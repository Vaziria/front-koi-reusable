import { shallowMount } from '@vue/test-utils'
import DiskusiReply from './DiskusiReply.vue'
import { single } from '../../mock/diskusi'
import { MockWrapper } from '../../mock/types'

let wrapper: MockWrapper<DiskusiReply>
const diskusi = single()

describe('DiskusiReply.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount<DiskusiReply>(DiskusiReply, {
      propsData: {
        diskusi
      }
    })
  })

  it('check data tampilan sesuai', () => {
    // user name
    expect(wrapper.vm.$el.querySelector('p.mb-0')?.innerHTML)
      .toBe(diskusi.name)

    // diskusi date
    expect(wrapper.vm.$el.querySelector('p.tx-gray-500')?.innerHTML)
      .toBe(wrapper.vm.$options.filters?.diskusiDate(diskusi))

    // reply text
    expect(wrapper.vm.$el.querySelector('p.ml-text')?.innerHTML)
      .toBe(diskusi.text)
  })

  it('check badge reply disembunyikan', () => {
    wrapper.setProps({
      showBadge: false
    })

    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.vm.$el.querySelector('.badge'))
        .toBeNull()
    })
  })

  it('check diskusi unreply', () => {
    wrapper.setProps({
      diskusi: {
        ...diskusi,
        replied: false
      },
      showBadge: true
    })

    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.vm.$el.querySelector('.badge')?.innerHTML)
        .toBe('unreply')
    })
  })

  it('check diskusi replied', () => {
    wrapper.setProps({
      diskusi: {
        ...diskusi,
        replied: true
      },
      showBadge: true
    })

    wrapper.vm.$nextTick().then(() => {
      expect(wrapper.vm.$el.querySelector('.badge')?.innerHTML)
        .toBe('replied')
    })
  })
})
