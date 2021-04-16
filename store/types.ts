import { DispatchOptions, CommitOptions, Store as VuexStore } from 'vuex'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StateType {

}

type Mutations = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string ]: (...args: any) => any
}

type Actions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string ]: (...args: any) => any
}

export type Commit<Mut extends Mutations> = {
    commit<K extends keyof Mut, P extends Parameters<Mut[K]>[1]>(
        key: K,
        payload?: P,
        options?: CommitOptions
    ): ReturnType<Mut[K]>
}

export type Dispatch<Act extends Actions> = {
    dispatch<K extends keyof Act>(
        key: K,
        payload?: Parameters<Act[K]>[1],
        options?: DispatchOptions
      ): ReturnType<Act[K]>
}

export type Context<Mut extends Mutations, St extends StateType> = Commit<Mut> & { state: St }

export type Namespaced<T, N extends string> = {
    [P in keyof T & string as `${N}/${P}`]: T[P]
  }

export type Store<S, Mut extends Mutations, Act extends Actions> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'> & Commit<Mut> & Dispatch<Act>
