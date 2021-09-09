import { ThreatTipe } from '../model/order'

export interface MapValue {
  key: ThreatTipe
  name: string
  color: string
  class: string
}

export const threatTipe: MapValue[] = [
  {
    key: 'ready',
    name: 'Siap Kirim',
    color: '#00cccc',
    class: ' bg-teal tx-white'
  },
  {
    key: 'karantina',
    name: 'Karantina',
    color: '#fa591d',
    class: ' bg-orange tx-white'
  },
  {
    key: 'titip',
    name: 'Dititipkan',
    color: '#3366ff',
    class: 'primary'
  }
]
