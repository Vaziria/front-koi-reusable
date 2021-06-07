declare module 'vue2-daterange-picker' {
  interface ComponentCustomProperties {
  }
  interface DateType {
    startDate: number,
    endDate: number
  }
  interface DateResult {
    startDate: Date,
    endDate: Date
  }
  type DateRanges = {
    [key: string]: Date[]
  }
}
