import { getAdminEmails, isAdminEmail } from '../utils/google-oauth'

defineRouteMeta({
  openAPI: {
    description: 'Verify the user session',
    responses: {
      200: {
        description: 'User is authenticated',
      },
      default: {
        description: 'User is not authenticated',
      },
    },
  },
})

export default eventHandler((event) => {
  const { context } = event
  const user = context.user

  if (!user?.email) {
    throw createError({ status: 401, statusText: 'Unauthorized' })
  }

  const config = useRuntimeConfig(event)
  const adminEmails = getAdminEmails(config)
  const isAdmin = isAdminEmail(user.email, adminEmails)

  return {
    name: 'Sink',
    url: 'https://sink.cool',
    email: user.email,
    isAdmin,
  }
})
