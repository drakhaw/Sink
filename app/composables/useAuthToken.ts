const TOKEN_KEY = 'SinkSiteToken'
const GOOGLE_TOKEN_KEY = 'SinkGoogleToken'

export function useAuthToken() {
  function getToken() {
    if (import.meta.client) {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }

  function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(GOOGLE_TOKEN_KEY)
  }

  function getGoogleToken() {
    if (import.meta.client) {
      return localStorage.getItem(GOOGLE_TOKEN_KEY)
    }
    return null
  }

  function setGoogleToken(token: string) {
    localStorage.setItem(GOOGLE_TOKEN_KEY, token)
  }

  return { getToken, setToken, removeToken, getGoogleToken, setGoogleToken }
}
