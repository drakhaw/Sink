import { z } from 'zod'
import { getAdminEmails, isAdminEmail } from '../../utils/google-oauth'
import { deleteUser } from '../../utils/user-store'

const DeleteUserSchema = z.object({
  email: z.string().email(),
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

  const body = await readValidatedBody(event, DeleteUserSchema.parse)

  await deleteUser(event, body.email)

  return { success: true }
})
