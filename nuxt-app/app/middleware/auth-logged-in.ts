export default defineNuxtRouteMiddleware(async () => {
    if (process.server && process.env.NUXT_PRERENDERING) return

    interface KindeUser {
        id: string
        email: string
        given_name: string
        family_name: string
    }

    interface AuthState {
        user?: KindeUser
        loggedIn?: boolean
    }

    const auth = useState<AuthState>('auth', () => ({}))
    const isLoggedIn = auth.value.loggedIn ?? false

    if (!isLoggedIn) {
        return navigateTo('/api/login', { external: true })
    }
})