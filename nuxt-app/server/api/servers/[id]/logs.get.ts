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

    if (server.type !== 'docker' || !server.dockerContainerId) {
      return {
        logs: server.logs || 'No logs available',
      };
    }

    const result = await dockerLogs(server.dockerContainerId, 200);

    return {
      logs: result.logs || result.error || 'No logs available',
    };
  } catch (error: any) {
    console.error('Error fetching server logs:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch server logs',
    });
  }
});
