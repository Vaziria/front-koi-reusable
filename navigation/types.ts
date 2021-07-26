import { RouteConfig } from 'vue-router'

export type RouteConfiguration<T> = RouteConfig & { name?: keyof T, displayName?: string, hidden?: boolean }

export type ChildNameSpaced<T, N extends string> = {
  [P in keyof T & string as `${N}_${P}`]: T[P]
}
