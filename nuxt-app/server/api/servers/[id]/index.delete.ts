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

    // Si un container existe, on le supprime
    if (server.type === 'docker' && server.dockerContainerId) {
      await dockerRemove(server.dockerContainerId, true);
    }

    // Supprimer de la DB
    await prisma.server.delete({
      where: { id },
    });

    return { success: true, message: 'Server deleted successfully' };
  } catch (error: any) {
    console.error('Error deleting server:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete server',
    });
  }
});
