import { PublicIkan } from '../model/ikan'

type IkanChat = Pick<PublicIkan, 'id' | 'gambar' | 'name' | 'kategori' | 'price' | 'me'>

export interface BasicRootEvent {
  addChart: IkanChat,
  pageloading: {
    show: boolean,
    text: string
  }
}
