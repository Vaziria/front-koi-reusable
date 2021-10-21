import { IIkan } from '../../model/ikan'
import { getRandomValue, getRandomNum, getId } from '../mock'
import { Wilayah } from '../../constant/wilayah'
import { categories } from '../../constant/kategori'
import { single as sellerSingle } from '../seller'

const middleName = [
  'Blitar',
  'bibit anakan import',
  'murah',
  'berkualitas',
  'murah berkualitas',
  '50 ekor',
  '30 ekor',
  'MIX 5 ekor',
  'Mix 10 ekor',
  'Mixx 15 ekor',
  '- Ikan Hias -'
]

const kategori = getRandomValue(categories)
const sexs: IIkan['sex'][] = ['male', 'female', 'uncheck']
const sex = getRandomValue(sexs)
const statuses: IIkan['status'][] = ['arsip', 'booked', 'draft', 'process', 'ready', 'sold']
const status = getRandomValue(statuses)
const size = getRandomNum(40) + 10

const sizeText = ['size {}cm', 'sz {} cm', '{}']
const fullName = 'Ikan Koi {} {} {}'
  .replace('{}', kategori)
  .replace('{}', getRandomValue(middleName))
  .replace('{}', getRandomValue(sizeText)
    .replace('{}', size.toString())
  )

const deskripsi = `
Ready Stok...!!
minggu tetap buka...

Deskripsi Ikan Koi Mantab dan Sehat
Siap Dikirim ke Seluruh Indonesia
Dijamin berkualitas

garansi sehat dan hidup hingga H+3, kita pastikan ikan benar2 dlm kondisi fit, bukan ikan pasaran yg seminggu udah mati....

WAJIB grab sameday/instan
lolos karantina garansi sehat, hidup sampai tujuan

Sehat sudah karantina dan siap masuk kolam
WA 081315568198`

const images = [
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/1.-Goromo.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/2.-Ogon.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/3.-Kinginrin.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/4.-Goshiki.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/5.-Hariwake.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/6.-Hikarimoyomono.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/7.-Taisho-Sanke.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/8.-Matsuba.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/9.-Showa-Sansoku.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/10.-Tancho.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/11.-Shiro-Utsuri.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/12.-Hi-Utsuri.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/13.-Ki-Utsuri.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/14.-Koi-Slayer.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/15.-Chagoi.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/16.-Ochiba-Shigure.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/17.-Soragoi.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/18.-Kumonryu.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/19.-Shuisui.jpg',
  'https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2019/07/20.-Kikokuryu.jpg'
]

export function single (): IIkan {
  const wilayah = getRandomValue(Wilayah)

  return {
    city: wilayah.region,
    created: new Date().getTime(),
    deskripsi,
    view: getRandomNum(100),
    gambar: [getRandomValue(images)],
    id: getId(11),
    kategori,
    like: 0,
    name: fullName,
    permalink_id: `${fullName.toLowerCase().split(' ').join('-')}-${getId(6)}`,
    price: getRandomNum(10000) * 1000,
    region: wilayah.province,
    seller: sellerSingle(),
    sex,
    ship_from: '',
    status,
    tags: [],
    thumbnail: getRandomValue(images),
    ukuran: size,
    ukuran_range: {
      min: 0,
      max: 0
    },
    user_id: getId(11),
    video: '',
    video_code: '',
    youtubeVideo: '',
    order_count: 0
  }
}
