// API pour corriger le dockerUser des games
export default defineEventHandler(async (event) => {
  try {
    const { gameId } = await readBody(event)

    if (!gameId) {
      throw createError({
        statusCode: 400,
        message: 'gameId required',
      })
    }

    const updated = await prisma.game.update({
      where: { id: gameId },
      data: {
        dockerUser: null,
      },
    })

    return {
      success: true,
      game: updated,
    }
  } catch (error: any) {
    console.error('Error updating game:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update game',
    })
  }
})
