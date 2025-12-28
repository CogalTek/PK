export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromRequest(event);

    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Server ID is required',
      });
    }

    const server = await prisma.server.findUnique({
      where: { id },
      include: {
        game: true,
      },
    });

    if (!server) {
      throw createError({
        statusCode: 404,
        message: 'Server not found',
      });
    }

    // Check ownership
    if (server.ownerId !== user.id) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden',
      });
    }

    return server;
  } catch (error: any) {
    console.error('Error fetching server:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch server',
    });
  }
});
