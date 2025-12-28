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

    let result;

    // Si le container existe déjà, on le démarre
    if (server.dockerContainerId) {
      await prisma.server.update({
        where: { id },
        data: { status: 'STARTING' },
      });

      result = await dockerStart(server.dockerContainerId);
    } else {
      // Sinon on crée un nouveau container
      await prisma.server.update({
        where: { id },
        data: { status: 'STARTING' },
      });

      const containerName = `${server.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_${server.id.substring(0, 8)}`;

      // Préparer les ports
      const ports: { [key: string]: number } = {};
      if (server.ports && typeof server.ports === 'object') {
        Object.assign(ports, server.ports as any);
      } else if (server.game.ports && Array.isArray(server.game.ports)) {
        server.game.ports.forEach((port: number) => {
          ports[port.toString()] = port;
        });
      }

      // Préparer l'env
      const env: { [key: string]: string } = {};
      if (server.env && typeof server.env === 'object') {
        Object.assign(env, server.env as any);
      } else if (server.game.env && typeof server.game.env === 'object') {
        Object.assign(env, server.game.env as any);
      }

      result = await dockerRun({
        image: server.game.image || '',
        name: containerName,
        ports,
        volumes: server.game.volumes || [],
        env,
        user: server.game.dockerUser || undefined,
        privileged: server.game.dockerPrivileged || false,
        restart: server.game.dockerRestart || 'unless-stopped',
      });

      if (result.success && result.containerId) {
        await prisma.server.update({
          where: { id },
          data: {
            dockerContainerId: result.containerId,
            status: 'RUNNING',
          },
        });
      }
    }

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
        message: `Failed to start server: ${result.error}`,
      });
    }

    const updatedServer = await prisma.server.findUnique({
      where: { id },
      include: { game: true },
    });

    return updatedServer;
  } catch (error: any) {
    console.error('Error starting server:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to start server',
    });
  }
});
