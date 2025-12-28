export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const user = await getUserFromRequest(event);

    // Validation
    if (!body.name || !body.type) {
      throw createError({
        statusCode: 400,
        message: 'Name and type are required',
      });
    }

    if (!['docker', 'linuxgsm'].includes(body.type)) {
      throw createError({
        statusCode: 400,
        message: 'Type must be "docker" or "linuxgsm"',
      });
    }

    if (body.type === 'docker' && !body.image) {
      throw createError({
        statusCode: 400,
        message: 'Docker image is required for docker type',
      });
    }

    const game = await prisma.game.create({
      data: {
        ownerId: user.id,
        name: body.name,
        type: body.type,
        image: body.image || null,
        gsmCommand: body.gsmCommand || null,
        startCmd: body.startCmd || null,
        stopCmd: body.stopCmd || null,
        volumes: body.volumes || [],
        env: body.envConfig || body.env || null,
        ports: body.ports || [],
        public: body.public || false,
        schemaId: body.schemaId || null,
        dockerUser: body.dockerUser || null,
        dockerPrivileged: body.dockerPrivileged || false,
        dockerRestart: body.dockerRestart || null,
      },
    });

    return game;
  } catch (error: any) {
    console.error('Error creating game:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create game',
    });
  }
});
