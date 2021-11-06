import { shallowMount } from '@vue/test-utils'
import ProductContainer from './ProductContainer.vue'
import { single } from '../../mock/ikan'
import store from '../../mock/store'
import { MockWrapper } from '../../mock/types'

let wrapper: MockWrapper<ProductContainer>
let getIkan: jest.Mock<void, [err?: boolean]>

const product = single()

describe('ProductContainer.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount<ProductContainer>(ProductContainer, {
      store
    })

    getIkan = jest.fn((err = false) => {
      if (!err) {
        wrapper.vm.product = product
      } else {
        wrapper.vm.product.name = 'Produk tidak ditemukan'
        wrapper.vm.product.gambar = ['error']
      }

      wrapper.vm.loading = false
    })
  })

  it('check produk loading', () => {
    expect(wrapper.vm.$el.querySelector('.bg-loading-200'))
      .not
      .toBe(undefined)
  })

  it('check produk tampil', () => {
    getIkan()
    expect(getIkan).toBeCalled()

    wrapper.vm.$nextTick().then(() => {
      // check badge status
      expect(wrapper.vm.$el.querySelector('.align-self-center.badge')?.innerHTML)
        .toEqual(product.status)

      // check produk name
      expect(wrapper.vm.$el.querySelector('.mb-0.text-truncate')?.innerHTML)
        .toEqual(product.name)
    })
  })

  it('check produk error', () => {
    getIkan(true)
    expect(getIkan).toBeCalled()

    wrapper.vm.$nextTick().then(() => {
      // check badge status
      expect(wrapper.vm.$el.querySelector('.align-self-center.badge')?.innerHTML)
        .toEqual('tidak ada status')

      // check produk name
      expect(wrapper.vm.$el.querySelector('.mb-0.text-truncate')?.innerHTML)
        .toEqual('Produk tidak ditemukan')
    })
  })

  it('check onclick emit click event', () => {
    const clickEvent = jest.fn(() => wrapper.trigger('click'))

    getIkan(true)
    expect(getIkan).toBeCalled()

    clickEvent()
    expect(clickEvent).toBeCalled()

    const eventEmitClick = wrapper.emitted('click')
    expect(eventEmitClick)
      .not
      .toBeUndefined()
  })
})
