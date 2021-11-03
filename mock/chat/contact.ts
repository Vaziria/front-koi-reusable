import { UserChat } from '../../model/chat'
import { getId, getRandomNum, getRandomValue } from '../mock'
import { single as singleChat } from './chat'

// eslint-disable-next-line camelcase
export function single (cs_id?: string): UserChat {
  const names = ['Agile', 'Kanban', 'Todo']

  return {
    unread: getRandomNum(10),
    last_msg: singleChat(getId(11), cs_id),
    last_chat: new Date().getTime(),
    cs_id: cs_id,
    id: getId(11),
    name: getRandomValue(names),
    seller_name: getRandomValue(names),
    state: 'online',
    photoUrl: '',
    profile_image: ''
  }
}

export function multiple (csid?: string, num = 10): UserChat[] {
  return Array.from(Array(num))
    .map(() => {
      return single(csid)
    })
}
