import { getAdminEmails, isAdminEmail } from '../../utils/google-oauth'
import { listUsers } from '../../utils/user-store'

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

  const users = await listUsers(event)
  return users
})
