/* eslint-disable camelcase */
import { Chat, UserChat } from '../model/chat'
import client from './client'

interface IChatParams {
  seller?: boolean
  start_after?: string
}

export async function chatRead (id: string, isSeller: boolean): Promise<unknown> {
  let params = {}
  if (isSeller) {
    params = {
      seller: true
    }
  }

  const data = await client.get(`/chat/read/${id}`, {
    params
  })
  return data.data
}

export async function chatList (isSeller: boolean, startAfter?: string): Promise<UserChat[]> {
  let url = ''
  if (isSeller) {
    url = '/chat/seller/list'
  } else {
    url = '/chat/list'
  }

  const res = await client.get(url, {
    params: {
      start_after: startAfter
    }
  })
  return res.data.data
}

export async function chatMessages (id: string, params: IChatParams): Promise<Chat[]> {
  if (!params.seller) {
    delete params.seller
  }

  const res = await client.get(`/chat/messages/${id}`, {
    params
  })
  return res.data.data
}

export async function getUserChat (userid: string): Promise<unknown> {
  const data = await client.get(`/chat/user/${userid}`)
  return data.data
}

export async function sendChat (id: string, isSeller: boolean, chat: Chat): Promise<Chat> {
  const data = await client.post(`/chat/${id}`, chat, {
    params: {
      seller: isSeller
    }
  })
  return data.data.data
}
