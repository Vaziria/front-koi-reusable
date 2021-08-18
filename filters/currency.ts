export default function (val: number): string {
  const rule = /(?=(?:...)*$)/
  const split3 = (val || 0).toString().split(rule)

  return 'Rp ' + split3.join('.')
}
