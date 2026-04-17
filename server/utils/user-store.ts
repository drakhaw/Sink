import type { H3Event } from 'h3'
import { z } from 'zod'

export const UserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'user']).default('user'),
  createdAt: z.number(),
})

export type User = z.infer<typeof UserSchema>

export async function getUser(event: H3Event, email: string): Promise<User | null> {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  return await KV.get(`user:${email}`, { type: 'json' }) as User | null
}

export async function setUser(event: H3Event, user: User): Promise<void> {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  await KV.put(`user:${user.email}`, JSON.stringify(user))
}

export async function deleteUser(event: H3Event, email: string): Promise<void> {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  await KV.delete(`user:${email}`)
}

export async function listUsers(event: H3Event): Promise<User[]> {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  const list = await KV.list({ prefix: 'user:' })

  const users = await Promise.all(
    (list.keys || []).map(async (key: { name: string }) => {
      const user = await KV.get(key.name, { type: 'json' })
      return user as User | null
    }),
  )

  return users.filter((u): u is User => u !== null)
}

export async function isAdmin(event: H3Event, email: string): Promise<boolean> {
  const user = await getUser(event, email)
  return user?.role === 'admin'
}
