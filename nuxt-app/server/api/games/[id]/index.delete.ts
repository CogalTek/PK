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
    });

    if (!game) {
      throw createError({
        statusCode: 404,
        message: 'Game not found',
      });
    }

    // Check ownership
    if (game.ownerId !== user.id) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden',
      });
    }

    await prisma.game.delete({
      where: { id },
    });

    return { success: true, message: 'Game deleted successfully' };
  } catch (error: any) {
    console.error('Error deleting game:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete game',
    });
  }
});
