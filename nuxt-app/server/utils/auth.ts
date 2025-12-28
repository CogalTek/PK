/**
 * Utilitaire pour récupérer l'utilisateur depuis le userId (kindeId) passé dans la requête
 */
export async function getUserFromRequest(event: any): Promise<any> {
  const query = getQuery(event);
  const body = event.method !== 'GET' ? await readBody(event) : {};
  
  const userId = (query.userId || body.userId) as string;

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'userId is required',
    });
  }

  // Récupérer l'utilisateur par kindeId
  const user = await prisma.user.findUnique({
    where: { kindeId: userId }
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    });
  }

  return user;
}
