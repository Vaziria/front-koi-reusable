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

const shortMonth = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des'
]

function dateZero (month: number): string {
  if (month < 10) {
    return '0' + month
  }

  return month.toString()
}

function dateFormater (datetime: number, format = 'DD/MM/YY'): string {
  const date = new Date(datetime)

  return format
    .replace(/YY/g, date.getFullYear().toString())
    .replace(/MNs/g, shortMonth[date.getMonth()])
    .replace(/MN/g, month[date.getMonth()])
    .replace(/MM/g, dateZero(date.getMonth() + 1))
    .replace(/DD/g, dateZero(date.getDate()))
    .replace(/HH/g, date.getHours().toString())
    .replace(/mm/g, date.getMinutes().toString())
    .replace(/ss/g, date.getSeconds().toString())
    .replace(/ms/g, date.getMilliseconds().toString())
}

export function getMonthIndex (datestring: string): number {
  let index = -1
  month.forEach((mon, ind) => {
    if (datestring.indexOf(mon) > 0) {
      index = ind
    }
  })

  return index
}

export default dateFormater
