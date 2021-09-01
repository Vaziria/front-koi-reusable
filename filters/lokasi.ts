import { Seller } from '../model/seller'

export function lokasiSeller (seller: Seller): string {
  const { region, city } = seller
  if (region && city) {
    return `${region}, ${city}`
  }

  if (region || city) {
    return region || city
  }

  return 'tidak ada lokasi'
}
