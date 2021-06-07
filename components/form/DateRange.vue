<template>
  <DateRangePicker
    :date-range="value"
    :ranges="ranges"
    :opens="direction"
    :min-date="minDate"
    :max-date="maxDate"
    :locale-data="locale"
    @update="setDateValue"
  >
    <template #input="picker">
      <div class="pd-t-2">
        <span v-if="dateText" class="mr-2">{{ dateText }}</span>
        <span v-if="picker.startDate">
          {{ picker.startDate | moment('DD MMM YYYY') }}
        </span>
        <span class="mx-2">-</span>
        <span v-if="picker.endDate">
          {{ picker.endDate | moment('DD MMM YYYY') }}
        </span>
      </div>
    </template>
    <div slot="footer" slot-scope="data" class="slot">
      <div v-if="!data.in_selection" class="p-2 tx-right">
        <button @click="data.clickCancel" class="btn btn-outline-info btn-sm mr-2 rounded-5">{{ data.locale.cancelLabel }}</button>
        <button @click="data.clickApply" class="btn btn-info btn-sm rounded-5">{{ data.locale.applyLabel }}</button>
      </div>
    </div>
  </DateRangePicker>
</template>
<style>
  .daterangepicker td.active, .daterangepicker td.active:hover {
    background-color: #EF6F91 !important;
  }
  .daterangepicker td.in-range {
    background-color: #FBC5D4;
  }
  .daterangepicker {
    top: 40px !important;
    position: absolute !important;
  }
</style>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import DateRangePicker, { DateType, DateRanges, DateResult } from 'vue2-daterange-picker'

import moment from '../../filters/moment'
import setDate from '../../utils/set_date'

type resultType = 'time' | 'date'

const zeroTime = {
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0
}

const beforeDayBreak = {
  hour: 23,
  minute: 59,
  second: 59,
  millisecond: 999
}

const startToday = setDate(new Date(), zeroTime)
const endToday = setDate(new Date(), beforeDayBreak)

const startYesterday = setDate(new Date(), {
  date: startToday.getDate() - 1,
  ...zeroTime
})
const endYesterday = setDate(new Date(), {
  date: startToday.getDate() - 1,
  ...beforeDayBreak
})

const startMonth = setDate(new Date(), {
  date: 1,
  ...zeroTime
})

const endMonth = setDate(new Date(), {
  month: startToday.getMonth() + 1,
  date: 0,
  ...beforeDayBreak
})

const startYear = setDate(new Date(), {
  month: 0,
  date: 1,
  ...zeroTime
})

const endYear = setDate(new Date(), {
  month: 11,
  date: 31,
  ...beforeDayBreak
})

@Component({
  components: {
    DateRangePicker
  },
  filters: {
    moment
  }
})
class DateRange extends Vue {
  @Prop() readonly value!: DateType
  @Prop() readonly dateText!: string
  @Prop({ default: 'time' }) readonly resultType!: resultType
  @Prop({ default: 'center' }) readonly direction!: string
  @Prop() readonly minDate!: Date
  @Prop() readonly maxDate!: Date
  @Prop({
    default: {
      'Hari ini': [startToday, endToday],
      Kemarin: [startYesterday, endYesterday],
      'Bulan ini': [startMonth, endMonth],
      'Tahun ini': [startYear, endYear]
    }
  }) readonly ranges!: DateRanges

  locale = {
    direction: 'ltr',
    format: 'mm/dd/yyyy',
    separator: ' - ',
    applyLabel: 'Terapkan',
    cancelLabel: 'Batal',
    weekLabel: 'W',
    customRangeLabel: 'Custom Range',
    daysOfWeek: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    firstDay: 0
  }

  @Emit('input')
  setDateValue (date: DateResult): DateType|DateResult {
    const startDate = setDate(date.startDate, zeroTime)
    const endDate = setDate(date.endDate, beforeDayBreak)

    if (this.resultType === 'time') {
      return {
        startDate: startDate.getTime(),
        endDate: endDate.getTime()
      }
    }

    return {
      startDate,
      endDate
    }
  }
}

export default DateRange

</script>
