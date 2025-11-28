export default defineEventHandler(async (event) => {
  // Récupérer le body de la requête
  const body = await readBody(event)
  
  // Exemple de validation
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Request body is required'
    })
  }
  
  try {
    // Votre logique ici
    const result = {
      success: true,
      data: body,
      timestamp: new Date().toISOString()
    }
    
    return result
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
