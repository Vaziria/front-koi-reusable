import VueRouter, { Location, Route } from 'vue-router'

export type FixLocation = Omit<Location, 'params'>
export class Navigator<Base> {
    router: VueRouter
    constructor (router: VueRouter) {
      this.router = router
    }

    get currentName (): keyof Base {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.router.currentRoute.name as any
    }

    get query (): { [k: string]: string } {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.router.currentRoute.query as any
    }

    current<K extends keyof Base> (): Base[ K ] & { name: K } {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params = this.router.currentRoute as any
      return params
    }

    push<K extends keyof Base> (key: K, ...[params]: Base[K] extends undefined ? [Location]: [Base[K] & FixLocation]): Promise<void|Route> {
      const location: Location = {}
      if (key) {
        location.name = key as string
      }

      Object.assign(location, params)

      return this.router
        .push(location)
        .catch(err => {
          if (typeof err === 'object') {
            // disable navigation duplicated
            if (err.name === 'NavigationDuplicated') {
              return
            }
          }
          throw err
        })
    }

    replace<K extends keyof Base> (key: K, ...[params]: Base[K] extends undefined ? [Location]: [Base[K] & FixLocation]): Promise<Route> {
      const location: Location = {}
      if (key) {
        location.name = key as string
      }

      Object.assign(location, params)

      return this.router.replace(location)
    }
}
