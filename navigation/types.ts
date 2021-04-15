import { RouteConfig } from 'vue-router'

export type RouteConfiguration<T> = RouteConfig & { name: keyof T }

export type ChildNameSpaced<T, N extends string> = {
  [P in keyof T & string as `${N}_${P}`]: T[P]
}
