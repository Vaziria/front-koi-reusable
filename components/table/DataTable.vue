<template>
  <div class="table-responsive">
    <table class="table mg-t-10 mg-b-0">
      <thead>
        <tr>
          <th
            v-for="head in headers"
            :key="head.key || head.name"
            class="pb-2"
          >{{ head.name }}</th>
        </tr>
      </thead>

      <tbody class="tx-12">
        <tr
          v-for="(item, key) in data"
          :key="key"
        >
          <td
            v-for="head in headers"
            :key="head.key || head.name + key"
          >
            <slot
              :name="head.key"
              :item="item[head.key || head.name]"
              :row="item"
              :row-key="head.key || head.name"
              :index="key"
            >
              {{ item[head.key || head.name] }}
            </slot>
          </td>

        </tr>

        <tr v-if="loading">
          <td colspan="100" class="tx-center">
            <div class="spinner-border tx-info" />
          </td>
        </tr>

      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

type CustomKey = '' | 'action' | 'stats'

export interface ITableRow<type> {
  item: type[keyof type]
  row: type
  rowKey: keyof type | CustomKey
  index: number
}

export interface ITable<type> {
  data: type[]
  headers: {
    name: string
    key: keyof type | CustomKey
  }[]
}

type unknownTable = ITable<unknown>

@Component
class DataTable extends Vue {
  @Prop({ required: true }) readonly headers!: unknownTable['headers']
  @Prop() readonly data!: unknownTable['data']
  @Prop() readonly loading!: boolean
}

export default DataTable

</script>
