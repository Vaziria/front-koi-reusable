import { Chat, UserChat } from '../model/chat'
import client from './client'

export async function chatRead (id: string, isSeller: boolean): Promise<unknown> {
  let params = {}
  if (isSeller) {
    params = {
      params: {
        seller: true
      }
    }
  }

  const data = await client.get(`/chat/read/${id}`, {
    params
  })
  return data.data
}

export async function chatList (isSeller: boolean): Promise<UserChat[]> {
  let url = ''

  if (isSeller) {
    url = '/chat/seller/list'
  } else {
    url = '/chat/list'
  }

  const data = await client.get(url)
  return data.data
}

export async function chatMessages (id: string, isSeller: boolean): Promise<Chat[]> {
  let params = {}
  if (isSeller) {
    params = {
      params: {
        seller: true
      }
    }
  }
  const res = await client.get(`/chat/messages/${id}`, params)
  return res.data
}

export async function getUserChat (userid: string): Promise<unknown> {
  const data = await client.get(`/chat/user/${userid}`)
  return data.data
}
