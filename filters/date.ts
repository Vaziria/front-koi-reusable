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

function dateFormater (datetime: number, format = 'DD/MM/YY'): string {
  const date = new Date(datetime)

  return format
    .replace(/YY/g, date.getFullYear() + '')
    .replace(/MNs/g, shortMonth[date.getMonth()])
    .replace(/MN/g, month[date.getMonth()])
    .replace(/MM/g, date.getMonth() + 1 + '')
    .replace(/DD/g, date.getDate() + '')
    .replace(/HH/g, date.getHours() + '')
    .replace(/mm/g, date.getMinutes() + '')
    .replace(/ss/g, date.getSeconds() + '')
    .replace(/ms/g, date.getMilliseconds() + '')
}

export default dateFormater
