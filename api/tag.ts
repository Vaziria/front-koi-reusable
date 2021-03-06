import client from './client'

export async function listTag (): Promise<{tag: string, count: number}[]> {
  const res = await client.get('/seller/tags')
  return res.data.data
}

export async function ikanAddTag (ikanid: string, tag: string): Promise<{ msg: string }> {
  const res = await client.post('/seller/tags/add', {
    ikanid,
    tag
  })

  return res.data
}

export async function ikanRemoveTag (ikanid: string, tag: string): Promise<{ msg: string }> {
  const res = await client.post('/seller/tags/remove', {
    ikanid,
    tag
  })

  return res.data
}

export async function deleteTag (tag: string): Promise<{ msg: string }> {
  const res = await client.post('/seller/tags/delete', { tag })
  return res.data
}
