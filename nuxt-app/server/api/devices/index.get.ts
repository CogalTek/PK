import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
	// Récupérer le kindeId depuis les query parameters
	const query = getQuery(event)
	const kindeId = query.userId as string

	// Validation
	if (!kindeId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'User ID is required'
		})
	}

	try {
		// Chercher l'utilisateur par son kindeId
		const user = await prisma.user.findUnique({
			where: {
				kindeId: kindeId
			}
		})

		if (!user) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'User not found'
			})
		}

		// Récupérer tous les devices de l'utilisateur
		const devices = await prisma.device.findMany({
			where: {
				ownerId: user.id
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return {
			success: true,
			devices: devices
		}
	} catch (error) {
		console.error('Error fetching devices:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: error instanceof Error ? error.message : 'Failed to fetch devices'
		})
	}
})
