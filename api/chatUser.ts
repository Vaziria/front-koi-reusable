import { UserChat, UserChatBasic, UserChatSeller } from '../model/chat'
import { getShop } from './shop'
import { getUser } from './user'

export const emptyUserActive: UserChatBasic = {
  id: '',
  unread: 0,
  last_chat: 0,
  last_msg: {
    id: '',
    from_id: '',
    to_id: '',
    created: 0
  },
  name: '',
  seller_name: '',
  state: 'offline',
  photoUrl: ''
}

export async function getUserChat (id: string): Promise<UserChat> {
  const user = await getUser(id)
  const userChat: UserChat = {
    ...emptyUserActive,
    id: user.id,
    name: user.name,
    photoUrl: user.photoUrl || ''
  }

  return userChat
}

export async function getSellerChat (shopid: string): Promise<UserChatSeller> {
  const seller = await getShop(shopid)
  const userChat: UserChatSeller = {
    ...emptyUserActive,
    ...seller,
    is_seller: true
  }

  return userChat
}
