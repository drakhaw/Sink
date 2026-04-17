declare module 'h3' {
  interface H3EventContext {
    cloudflare: {
      request: Request<unknown, IncomingRequestCfProperties>
      env: Cloudflare.Env
      context: ExecutionContext
    }
    user?: {
      email: string
      isAdmin: boolean
      googleAccessToken?: string
    }
  }
}

export {}
