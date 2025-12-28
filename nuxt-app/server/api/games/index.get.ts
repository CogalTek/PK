export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromRequest(event);

    const games = await prisma.game.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          { public: true },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return games;
  } catch (error: any) {
    console.error('Error fetching games:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch games',
    });
  }
});
