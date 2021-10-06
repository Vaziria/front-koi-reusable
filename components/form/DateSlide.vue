<template>
  <div class="d-flex tx-center tx-bold">
    <!-- days -->
    <div class="col-4 p-0">
      <a class="py-3 d-block" @click="addDays(-1)">
        <i class="fa fa-chevron-up"></i>
      </a>
      <div
        v-for="(day, index) in days"
        :key="day"
        :class="{
          'py-2 ht-40 d-block': true,
          'bg-gray-200': index === 1
        }"
      >{{ day }}</div>
      <a class="py-3 d-block" @click="addDays(1)">
        <i class="fa fa-chevron-down"></i>
      </a>
    </div>

    <!-- months -->
    <div class="col-4 p-0">
      <a class="py-3 d-block" @click="addmonth(-1)">
        <i class="fa fa-chevron-up"></i>
      </a>
      <div
        v-for="(month, index) in months"
        :key="month"
        :class="{
          'py-2 ht-40 d-block': true,
          'bg-gray-200': index === 1
        }"
      >{{ month }}</div>
      <a class="py-3 d-block" @click="addmonth(1)">
        <i class="fa fa-chevron-down"></i>
      </a>
    </div>

    <!-- years -->
    <div class="col-4 p-0">
      <a class="py-3 d-block" @click="addYear(-1)">
        <i class="fa fa-chevron-up"></i>
      </a>
      <div
        v-for="(year, index) in years"
        :key="year"
        :class="{
          'py-2 ht-40 d-block': true,
          'bg-gray-200': index === 1
        }"
      >{{ year }}</div>
      <a class="py-3 d-block" @click="addYear(1)">
        <i class="fa fa-chevron-down"></i>
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

const month = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]

const currentDate = new Date()

@Component
class DateSlide extends Vue {
  @Prop() readonly value!: number

  get currentDay (): number {
    if (this.value) {
      return new Date(this.value)
        .getDate()
    }

    return currentDate.getDate()
  }

  get currentMonth (): number {
    if (this.value) {
      return new Date(this.value)
        .getMonth()
    }

    return currentDate.getMonth()
  }

  get currentYear (): number {
    if (this.value) {
      return new Date(this.value)
        .getFullYear()
    }

    return currentDate.getFullYear()
  }

  get days (): string[] {
    const numDays = new Date(this.currentYear, this.currentMonth, 0).getDate()
    const days = ['', this.currentDay.toString(), '']

    if (this.currentDay > 1) {
      days[0] = (this.currentDay - 1).toString()
    }
    if (this.currentDay < numDays) {
      days[2] = (this.currentDay + 1).toString()
    }

    return days
  }

  get months (): string[] {
    const months = ['', month[this.currentMonth], '']

    if (this.currentMonth > 0) {
      months[0] = month[this.currentMonth - 1]
    }
    if (this.currentMonth < 11) {
      months[2] = month[this.currentMonth + 1]
    }

    return months
  }

  get years (): string[] {
    const years = ['', this.currentYear.toString(), '']

    if (this.currentYear > 1980) {
      years[0] = (this.currentYear - 1).toString()
    }
    if (this.currentYear < currentDate.getFullYear()) {
      years[2] = (this.currentYear + 1).toString()
    }

    return years
  }

  @Emit('input')
  addDays (day: number): number {
    const numDays = new Date(this.currentYear, this.currentMonth, 0).getDate()
    const isMinimum = day < 0 && this.currentDay === 1
    const isMaximum = day > 0 && this.currentDay === numDays
    if (isMinimum || isMaximum) {
      return this.value
    }

    const result = new Date(
      this.currentYear,
      this.currentMonth,
      this.currentDay + day
    )
    return result.getTime()
  }

  @Emit('input')
  addmonth (month: number): number {
    const isMinimum = month < 0 && this.currentMonth === 0
    const isMaximum = month > 0 && this.currentMonth === 11
    if (isMinimum || isMaximum) {
      return this.value
    }

    const result = new Date(
      this.currentYear,
      this.currentMonth + month,
      1
    )
    return result.getTime()
  }

  @Emit('input')
  addYear (year: number): number {
    const isMinimum = year < 0 && this.currentYear === 1980
    const isMaximum = year > 0 && this.currentYear === currentDate.getFullYear()
    if (isMinimum || isMaximum) {
      return this.value
    }

    const result = new Date(
      this.currentYear + year,
      this.currentMonth,
      1
    )
    return result.getTime()
  }
}

export default DateSlide
</script>
