import { z } from 'zod'
import { getAdminEmails, isAdminEmail } from '../../utils/google-oauth'
import { setUser } from '../../utils/user-store'

const CreateUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'user']).default('user'),
})

export default eventHandler(async (event) => {
  const { context } = event
  const user = context.user

  if (!user?.email) {
    throw createError({ status: 401, statusText: 'Unauthorized' })
  }

  const config = useRuntimeConfig(event)
  const adminEmails = getAdminEmails(config)
  const isAdmin = isAdminEmail(user.email, adminEmails)

  if (!isAdmin) {
    throw createError({ status: 403, statusText: 'Forbidden' })
  }

  const body = await readValidatedBody(event, CreateUserSchema.parse)

  const newUser = await setUser(event, {
    email: body.email.toLowerCase(),
    role: body.role,
    createdAt: Date.now(),
  })

  return { success: true, user: newUser }
})
