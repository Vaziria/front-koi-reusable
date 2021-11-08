import { shallowMount } from '@vue/test-utils'
import DiskusiReplies from './DiskusiReplies.vue'
import DiskusiReply from './DiskusiReply.vue'
import BasicButton from '../../components/button/BasicButton.vue'
import { single, multiple } from '../../mock/diskusi/withReplies'
import { MockWrapper } from '../../mock/types'
import { Diskusi } from '../../model/diskusi'

let wrapper: MockWrapper<DiskusiReplies>
const diskusi = single()

describe('DiskusiReplies.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount<DiskusiReplies>(DiskusiReplies, {
      propsData: {
        diskusi
      }
    })

    wrapper.vm.getReplies = async () => {
      wrapper.vm.loadReply = true
      wrapper.vm.replies = multiple()
      wrapper.vm.loading = false
    }
  })

  it('check button show replies', () => {
    const buttonShowReplies = wrapper.findComponent(BasicButton)

    expect(buttonShowReplies.exists())
      .toBe(true)

    expect(buttonShowReplies.text())
      .toBe('Lihat semua balasan')
  })

  it('check button hide replies', () => {
    wrapper.vm.showReplies()
    wrapper.vm.$nextTick().then(() => {
      const buttonShowReplies = wrapper.findComponent(BasicButton)

      expect(buttonShowReplies.exists())
        .toBe(true)

      expect(buttonShowReplies.text())
        .toBe('Sembunyikan balasan')
    })
  })

  it('check all replies show and hide', async () => {
    // on show
    wrapper.vm.showReplies()
    await wrapper.vm.$nextTick().then(() => {
      const allReplies = wrapper.findAllComponents(DiskusiReply)
      const allReplyIds = allReplies.wrappers.map(wrap => {
        return wrap.props().diskusi.id
      })

      // show replies
      expect(wrapper.vm.showReply)
        .toBe(true)

      // check all diskusi reply show
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      expect(wrapper.vm.allReplies.map((value: Diskusi, index: number, array: Diskusi[]) => value.id))
        .toStrictEqual(allReplyIds)
    })

    wrapper.vm.hideReplies()
    await wrapper.vm.$nextTick().then(() => {
      const allReplies = wrapper.findAllComponents(DiskusiReply)

      // hide replies
      expect(wrapper.vm.showReply)
        .toBe(false)

      // check all diskusi reply hidden
      expect(allReplies.length)
        .toBe(0)
    })
  })
})
