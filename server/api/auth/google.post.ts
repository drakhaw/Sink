import type { H3Event } from 'h3'
import { z } from 'zod'
import { exchangeCodeForTokens, getGoogleUserInfo } from '../../utils/google-oauth'

const GoogleAuthRequestSchema = z.object({
  code: z.string().min(1),
})

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, GoogleAuthRequestSchema.parse)
  const redirectUri = getRedirectUri(event)

  const tokens = await exchangeCodeForTokens(event, body.code, redirectUri)
  if (!tokens) {
    throw createError({ status: 400, statusText: 'Failed to exchange code for tokens' })
  }

  const userInfo = await getGoogleUserInfo(tokens.access_token)
  if (!userInfo) {
    throw createError({ status: 400, statusText: 'Failed to get user info' })
  }

  return {
    accessToken: tokens.access_token,
    idToken: tokens.id_token,
    email: userInfo.email,
    name: userInfo.name,
  }
})

function getRedirectUri(event: H3Event): string {
  const host = getRequestHost(event)
  const protocol = getRequestProtocol(event)
  return `${protocol}://${host}/dashboard/auth/callback`
}
