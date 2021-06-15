// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const categIcon: any = {
  kohaku: 'kohaku',
  sanke: 'sanke',
  showa: 'showa',
  'aka hajiro': 'aka_hajiro',
  'aka matsuba': 'aka_matsuba',
  akamuji: 'akamuji',
  benigoi: 'benigoi',
  kumonryu: 'kumonryu',
  benikumonryu: 'benikumonryu',
  chagoi: 'chagoi',
  karashi: 'karashi',
  karashu: 'karashu',
  kigoi: 'kigoi',
  midori: 'midori',
  'ochiba sigure': 'ochiba_sigure',
  koromo: 'koromo',
  goshiki: 'goshiki',
  bekko: 'bekko',
  hariwake: 'hariwake',
  kikushui: 'kikushui',
  kujaku: 'kujaku',
  platinum: 'paltinum',
  shusui: 'shusui',
  asagi: 'asagi',
  'hi utsuri': 'hi_utsuri',
  'ki utsuri': 'ki_utsuri',
  'aka bekko': 'aka_bekko',
  'ki bekko': 'ki_bekko',
  tancho: 'tancho',
  soragoi: 'soragoi',
  slayer: 'slayer',
  lainnya: 'slayer'
}

export const categories: string[] = Object.keys(categIcon)

export const categByLetter = categories
  .sort((a, b) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })
