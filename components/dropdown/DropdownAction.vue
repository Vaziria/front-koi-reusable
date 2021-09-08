<template>
  <mdb-dropdown>
    <slot name="toggle" slot="toggle">
    </slot>
    <mdb-dropdown-menu class="bd rounded-5 tx-gray-800 shadow-base">
      <mdb-dropdown-item
        v-for="(item, index) in dropdownItems"
        :key="index"
        v-bind="item.props"
        v-on="item.on"
      >{{ item.text }}</mdb-dropdown-item>
    </mdb-dropdown-menu>
  </mdb-dropdown>
</template>
<style scoped>
  .dropdown-divider {
    padding: 0 !important;
    border-width: 1px !important;
  }
</style>
<script lang="ts">
import { mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle } from 'mdbvue'
import { Vue, Component, Prop } from 'vue-property-decorator'

type Divider = {
  type: 'divider'
}
type Dropdown = {
  text: string
  disabled?: boolean
  active?: boolean
}

interface IDropdownBasic extends Dropdown {
  type: 'basic'
}

interface IDropdownAction extends Dropdown {
  type: 'action'
  action(): void
}

interface IDropdownLink extends Dropdown {
  type: 'link'
  href: string
  newTab?: boolean
}

export type IDropdown = Divider | IDropdownBasic | IDropdownAction | IDropdownLink

type DropdownItem = {
  props: mdbDropdownItem['props']
  text: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  on: Record<string, Function | Function[]>
}

const dividerClass = 'dropdown-divider bd-t bd-gray-200 m-0'

@Component({
  components: {
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle
  }
})
class DropdownBasic extends Vue {
  @Prop({ default: [] }) readonly items!: IDropdown[]

  get dropdownItems (): DropdownItem[] {
    const dropdownItems = this.items.map(item => {
      const props: DropdownItem['props'] = {}
      const on: DropdownItem['on'] = {}
      let text = ''

      if (item.type === 'divider') {
        props.class = dividerClass
      } else {
        text = item.text
        props.disabled = item.disabled
        props.active = item.active
      }

      if (item.type === 'link') {
        props.href = item.href
        props.newTab = item.newTab
      }

      if (item.type === 'action') {
        on.click = item.action
      }

      return {
        props,
        text,
        on
      }
    })

    return dropdownItems
  }
}

export default DropdownBasic
</script>
