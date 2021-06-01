type DateType = 'millisecond' | 'second' | 'minute' | 'hour' | 'date' | 'month' | 'year'
type SetDate = {
  [key in DateType]?: number
}

export function setDate (date: Date, format: SetDate): Date {
  let key:DateType

  for (key in format) {
    const value = format[key] || 0

    if (key === 'millisecond') {
      date.setMilliseconds(value)
    }
    if (key === 'second') {
      date.setSeconds(value)
    }
    if (key === 'minute') {
      date.setMinutes(value)
    }
    if (key === 'hour') {
      date.setHours(value)
    }
    if (key === 'date') {
      date.setDate(value)
    }
    if (key === 'month') {
      date.setMonth(value)
    }
    if (key === 'year') {
      date.setFullYear(value)
    }
  }
  return date
}

export default setDate
