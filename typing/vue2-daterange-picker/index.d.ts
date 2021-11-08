declare module 'vue2-daterange-picker' {
  type ComponentCustomProperties = {
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
