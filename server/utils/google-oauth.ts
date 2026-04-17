import type { H3Event } from 'h3'

interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
  id_token: string
}

interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture: string
}

export async function exchangeCodeForTokens(
  event: H3Event,
  code: string,
  redirectUri: string,
): Promise<GoogleTokenResponse | null> {
  const { googleClientId, googleClientSecret } = useRuntimeConfig(event)

  if (!googleClientId || !googleClientSecret) {
    return null
  }

  try {
    const response = await $fetch<GoogleTokenResponse>('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    return response
  }
  catch {
    return null
  }
}

export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await $fetch<GoogleUserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response
  }
  catch {
    return null
  }
}

export function getAdminEmails(config: ReturnType<typeof useRuntimeConfig>): string[] {
  const { adminEmails } = config
  if (!adminEmails) {
    return []
  }
  return adminEmails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
}

export function isAdminEmail(email: string, adminEmails: string[]): boolean {
  return adminEmails.includes(email.toLowerCase())
}
