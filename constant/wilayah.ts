import alamat from './alamat'

interface Nested {
  [key: string]: {
    [key: string]: {
      [key: string]: string[]
    }
  }
}

export const ProvinsiNested:Nested = alamat
export const Provinsi = Object.keys(ProvinsiNested)

export const KotaNested = Object.values(ProvinsiNested)
  .reduce((result, kotas) => {
    Object.assign(result, kotas)
    return result
  }, {})
export const Kota = Object.keys(KotaNested)

export const KecamatanNested:{[key: string]: string[]} = Object.keys(KotaNested)
  .reduce((result, kecamatan) => {
    Object.assign(result, KotaNested[kecamatan])
    return result
  }, {})
export const Kecamatan = Object.keys(KecamatanNested)

export interface wilayahProps {
  name: string
  province: string
  region: string
  district: string
  'postal_code': string
}

export const Wilayah = Provinsi.reduce((result: wilayahProps[], provinsi) => {
  Object.keys(ProvinsiNested[provinsi])
    .map(kota =>
      Object.keys(KotaNested[kota])
        .map(kecamatan =>
          KecamatanNested[kecamatan]
            .map(kodepos =>
              result.push({
                name: `${kodepos} - ${provinsi}, ${kota}, ${kecamatan}`,
                province: provinsi,
                region: kota,
                district: kecamatan,
                postal_code: kodepos
              })
            )
        )
    )
  return result
}, [])
