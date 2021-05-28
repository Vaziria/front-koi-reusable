/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function (val: number, region = 'id-ID', currency = 'IDR'): string {
  return new Intl.NumberFormat(region, { style: 'currency', currency: currency }).format(val).replace(',00', '')
}
