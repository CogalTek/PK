export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const user = await getUserFromRequest(event);

    // Validation
    if (!body.gameId || !body.name) {
      throw createError({
        statusCode: 400,
        message: 'gameId and name are required',
      });
    }

    // Vérifier que le game existe et appartient à l'utilisateur ou est public
    const game = await prisma.game.findUnique({
      where: { id: body.gameId },
    });

    if (!game) {
      throw createError({
        statusCode: 404,
        message: 'Game not found',
      });
    }

    if (game.ownerId !== user.id && !game.public) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden - you cannot create servers from this game',
      });
    }

    // Créer le server en DB
    const server = await prisma.server.create({
      data: {
        ownerId: user.id,
        gameId: body.gameId,
        name: body.name,
        type: game.type,
        host: body.host || 'localhost',
        ports: body.ports || game.ports || null,
        env: body.env || game.env || null,
        status: 'STOPPED',
      },
      include: {
        game: true,
      },
    });

    return server;
  } catch (error: any) {
    console.error('Error creating server:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create server',
    });
  }
});
