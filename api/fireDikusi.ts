import { Diskusi } from '../model/diskusi'
import { sellerDiskusisCol } from '../utils/firebaseCollection'

export async function getSellerDiskusi (shopid: string): Promise<Diskusi[]> {
  const diskusis: Diskusi[] = []
  const data = await sellerDiskusisCol(shopid)
    .get()

  data.docs.forEach(diskusi => {
    if (diskusi.exists) {
      diskusis.push(diskusi.data() as Diskusi)
    }
  })

  return diskusis
}
