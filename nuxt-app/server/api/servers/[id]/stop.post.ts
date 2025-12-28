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
      include: { game: true },
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

    if (server.type !== 'docker') {
      throw createError({
        statusCode: 400,
        message: 'Only Docker servers are supported for now',
      });
    }

    if (!server.dockerContainerId) {
      throw createError({
        statusCode: 400,
        message: 'No Docker container associated with this server',
      });
    }

    await prisma.server.update({
      where: { id },
      data: { status: 'STOPPING' },
    });

    const result = await dockerStop(server.dockerContainerId);

    if (!result.success) {
      await prisma.server.update({
        where: { id },
        data: {
          status: 'FAILED',
          logs: result.error,
        },
      });

      throw createError({
        statusCode: 500,
        message: `Failed to stop server: ${result.error}`,
      });
    }

    const updatedServer = await prisma.server.update({
      where: { id },
      data: { status: 'STOPPED' },
      include: { game: true },
    });

    return updatedServer;
  } catch (error: any) {
    console.error('Error stopping server:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to stop server',
    });
  }
});
