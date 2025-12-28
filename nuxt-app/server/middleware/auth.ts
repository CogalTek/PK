export default defineEventHandler(async (event) => {
  // Ne pas exécuter pour les routes publiques ou API auth ou icônes
  const url = event.path
  if (
    url.startsWith('/api/auth/') || 
    url.startsWith('/_nuxt/') || 
    url.startsWith('/api/_nuxt_icon/') ||
    url.startsWith('/api/callback') || 
    !url.startsWith('/api/')
  ) {
    return
  }

  console.log('🔐 Auth middleware - Path:', url)

  try {
    // Essayer de récupérer directement depuis le context qui pourrait être défini par Kinde
    // Le module @nuxtjs/kinde pourrait définir event.context.kinde
    console.log('🔍 Event context keys:', Object.keys(event.context))
    
    // Essayer plusieurs cookies possibles
    const cookies = parseCookies(event)
    console.log('🍪 All cookies:', Object.keys(cookies))
    
    // Chercher un cookie qui contient l'utilisateur
    const possibleUserCookies = ['kinde_user', 'user', 'auth_user', 'kinde-user']
    for (const cookieName of possibleUserCookies) {
      if (cookies[cookieName]) {
        console.log(`🔍 Found cookie: ${cookieName}`)
        try {
          const userData = JSON.parse(cookies[cookieName])
          console.log('� User data from cookie:', userData)
        } catch (e) {
          console.log(`Cookie ${cookieName} is not JSON`)
        }
      }
    }
    
    // Pour l'instant, on va extraire l'utilisateur depuis event.context.auth si disponible
    // sinon on va chercher directement dans les cookies Kinde
    if (event.context.auth?.user) {
      console.log('✅ Found user in event.context.auth')
      const kindeUser = event.context.auth.user
      const kindeId = kindeUser.id
      
      const user = await prisma.user.findUnique({
        where: { kindeId }
      })

      if (user) {
        console.log('✅ User found in DB:', user.email)
        event.context.user = user
      } else {
        console.warn('⚠️  User not found in database, kindeId:', kindeId)
      }
    } else {
      console.log('❌ No user in event.context.auth')
    }
  } catch (error) {
    console.error('💥 Error in auth middleware:', error)
  }
})
