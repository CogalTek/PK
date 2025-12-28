export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromRequest(event);

    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Game ID is required',
      });
    }

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        servers: true,
      },
    });

    if (!game) {
      throw createError({
        statusCode: 404,
        message: 'Game not found',
      });
    }

    // Check ownership or public
    if (game.ownerId !== user.id && !game.public) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden',
      });
    }

    return game;
  } catch (error: any) {
    console.error('Error fetching game:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch game',
    });
  }
});
