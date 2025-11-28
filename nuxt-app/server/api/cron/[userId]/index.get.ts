import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id')
	console.log('event.context.params:', event.context.params)
    console.log('Fetching crons for userID:', id)
	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'User ID is required'
		})
	}

	try {
		// Récupérer l'utilisateur interne
		const user = await prisma.user.findUnique({
			where: { kindeId: id }
		})
		if (!user) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'User not found'
			})
		}

		// Récupérer toutes les tâches cron (WakeOnLan) de l'utilisateur
		const crons = await prisma.wakeOnLan.findMany({
			where: { ownerId: user.id },
			include: {
				device: true,
				calendar: {
					include: { dateTimes: true }
				}
			}
		})

        console.log(`Fetched ${crons.length} crons for user ${id}`)

		return {
			success: true,
			crons
		}
	} catch (error) {
		console.error('Error fetching crons:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: error instanceof Error ? error.message : 'Failed to fetch crons'
		})
	}
})
