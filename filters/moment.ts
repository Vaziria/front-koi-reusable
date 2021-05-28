/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'

export function basicDate (value: any, format = 'DD MMMM YYYY, HH:mm:ss'): string {
  return value && moment(value).locale('id').format(format)
}

export function fromNow (value: any): string {
  return value && moment(value).locale('id').fromNow()
}

export default basicDate
