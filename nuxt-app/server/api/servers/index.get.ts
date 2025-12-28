export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromRequest(event);

    const servers = await prisma.server.findMany({
      where: { ownerId: user.id },
      include: {
        game: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return servers;
  } catch (error: any) {
    console.error('Error fetching servers:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch servers',
    });
  }
});
