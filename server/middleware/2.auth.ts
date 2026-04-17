import type { H3Event } from 'h3'
import { getAdminEmails, isAdminEmail } from '../utils/google-oauth'

export default eventHandler(async (event) => {
  const authHeader = getHeader(event, 'Authorization')

  if (!event.path.startsWith('/api/')) {
    return
  }

  // Require Google OAuth token
  if (!authHeader?.startsWith('Google ')) {
    throw createError({ status: 401, statusText: 'Unauthorized - Google login required' })
  }

  const googleToken = authHeader.replace(/^Google\s+/, '')
  const userInfo = await verifyGoogleAccessToken(event, googleToken)
  if (!userInfo) {
    throw createError({ status: 401, statusText: 'Invalid Google token' })
  }

  const config = useRuntimeConfig(event)
  const adminEmails = getAdminEmails(config)

  // Store user info in context for later use
  event.context.user = {
    email: userInfo.email,
    isAdmin: isAdminEmail(userInfo.email, adminEmails),
    googleAccessToken: googleToken,
  }
})

async function verifyGoogleAccessToken(
  event: H3Event,
  accessToken: string,
): Promise<{ email: string } | null> {
  try {
    const response = await $fetch<{ email: string }>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return response.email ? { email: response.email } : null
  }
  catch {
    return null
  }
}
