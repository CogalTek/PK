export default defineEventHandler(async (event) => {
  // Récupérer les paramètres de query
  const query = getQuery(event)
  
  // Exemple de traitement
  try {
    // Votre logique ici
    const data = {
      message: 'Success',
      timestamp: new Date().toISOString(),
      query
    }
    
    return data
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
