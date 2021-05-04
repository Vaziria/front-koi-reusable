export type RoleKey = 'root' | 'seller' | 'cs'

export interface Access {
    role: RoleKey[]
    shopid: string,
    shopverif?: boolean
}
