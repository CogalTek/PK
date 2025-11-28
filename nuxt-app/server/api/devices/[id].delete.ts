import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
	// Récupérer l'ID du device depuis les paramètres
	const id = getRouterParam(event, 'id')

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Device ID is required'
		})
	}

	try {
		// Vérifier que le device existe
		const device = await prisma.device.findUnique({
			where: { id }
		})

		if (!device) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'Device not found'
			})
		}

		// Supprimer le device
		await prisma.device.delete({
			where: { id }
		})

		return {
			success: true,
			message: 'Device deleted successfully'
		}
	} catch (error) {
		console.error('Error deleting device:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: error instanceof Error ? error.message : 'Failed to delete device'
		})
	}
})
