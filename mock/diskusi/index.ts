import { Diskusi } from '../../model/diskusi'
import { getId, getRandomValue } from '../mock'

export function single (shopid = '', replied?: boolean): Diskusi {
  const names = ['Agile', 'Kanban', 'Todo']
  if (typeof replied === 'undefined') {
    replied = getRandomValue([true, false])
  }

  return {
    shopid,
    ikanid: getId(11),
    last_reply: new Date().getTime(),
    created: new Date().getTime(),
    userid: getId(11),
    has_reply: true,
    replied,
    reply_id: getId(11),
    id: getId(11),
    img_profile: '',
    name: getRandomValue(names),
    text: 'test'
  }
}
