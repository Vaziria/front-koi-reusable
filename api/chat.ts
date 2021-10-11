/* eslint-disable camelcase */
import firebase from 'firebase'
import { Chat, ChatInfoBuyer, ChatInfoSeller, UserChat } from '../model/chat'
import client from './client'

interface IPaginateParams {
  start_after?: string
  limit?: number
}

interface IChatparams extends IPaginateParams {
  seller?: boolean
}

type FireReq = firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

const fire = firebase.firestore()
const defaultLastMsg = {
  id: '',
  from_id: '',
  to_id: '',
  created: 0
}

function chatsSeller (id: string, sellerid: string): FireReq {
  return fire
    .collection('Sellers')
    .doc(sellerid)
    .collection('seller_chats')
    .doc(id)
}

function chatsBuyer (id: string, sellerid: string): FireReq {
  return fire
    .collection('Users')
    .doc(id)
    .collection('chats')
    .doc(sellerid)
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

export async function getContact (id: string, sellerid: string): Promise<ChatInfoBuyer> {
  const user = await chatsBuyer(id, sellerid).get()

  if (user.exists) {
    return user.data() as ChatInfoBuyer
  }

  return {
    cs_id: '',
    last_chat: 0,
    last_msg: defaultLastMsg,
    unread: 0
  }
}

export async function getContactSeller (id: string, sellerid: string): Promise<ChatInfoSeller> {
  const user = await chatsSeller(id, sellerid).get()

  if (user.exists) {
    return user.data() as ChatInfoSeller
  }

  return {
    last_chat: 0,
    last_msg: defaultLastMsg,
    unread: 0
  }
}

export async function chatList (isSeller: boolean, params: IPaginateParams): Promise<UserChat[]> {
  let url = ''
  if (isSeller) {
    url = '/chat/seller/list'
  } else {
    url = '/chat/list'
  }

  const res = await client.get(url, {
    params
  })
  return res.data.data
}

export async function chatMessages (id: string, params: IChatparams): Promise<Chat[]> {
  if (!params.seller) {
    delete params.seller
  }

  const res = await client.get(`/chat/messages/${id}`, {
    params
  })
  return res.data.data
}

export async function getUserChat (userid: string): Promise<UserChat> {
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
