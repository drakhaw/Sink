import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import { navigateTo } from '#imports'
import { useAuthToken } from '@/composables/useAuthToken'

type APIOptions = Omit<NitroFetchOptions<NitroFetchRequest>, 'headers'> & {
  headers?: Record<string, string>
}

export function useAPI<T = unknown>(api: string, options?: APIOptions): Promise<T> {
  const { getGoogleToken, removeToken } = useAuthToken()

  const googleToken = getGoogleToken()
  if (!googleToken) {
    navigateTo('/dashboard/login')
    return Promise.reject(new Error('Not authenticated'))
  }

  const mergedOptions = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Google ${googleToken}`,
    },
  }

  return $fetch<T>(api, mergedOptions).catch((error) => {
    if (error?.status === 401) {
      removeToken()
      navigateTo('/dashboard/login')
    }
    throw error
  }) as Promise<T>
}
