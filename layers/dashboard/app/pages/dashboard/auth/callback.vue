<script setup lang="ts">
import { toast } from 'vue-sonner'

const { t } = useI18n()
const route = useRoute()
const { setGoogleToken } = useAuthToken()

const code = route.query.code as string
const error = route.query.error as string

onMounted(async () => {
  if (error) {
    toast.error(t('login.oauth_error'), { description: error })
    navigateTo('/dashboard/login')
    return
  }

  if (!code) {
    toast.error(t('login.oauth_error'), { description: 'No authorization code' })
    navigateTo('/dashboard/login')
    return
  }

  try {
    const result = await $fetch<{ accessToken: string }>('/api/auth/google', {
      method: 'POST',
      body: { code },
    })

    setGoogleToken(result.accessToken)
    navigateTo('/dashboard')
  }
  catch (e) {
    console.error(e)
    toast.error(t('login.oauth_error'), {
      description: e instanceof Error ? e.message : String(e),
    })
    navigateTo('/dashboard/login')
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <Card class="w-full max-w-sm">
      <CardContent class="pt-6">
        <div class="flex flex-col items-center gap-4">
          <div
            class="
              h-8 w-8 animate-spin rounded-full border-4 border-primary
              border-t-transparent
            "
          />
          <p class="text-sm text-muted-foreground">
            {{ $t('login.oauth_loading') }}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
