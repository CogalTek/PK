import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
	// Récupérer le body de la requête
	const body = await readBody(event)
	console.log(body)

	// Validation
	if (!body || !body.device || !body.user) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Device and user are required'
		})
	}

	const { device, user } = body

	// Validation des champs du device
	if (!device.macAddress) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'MAC address is required'
		})
	}

	try {
		// Chercher l'utilisateur par son kindeId
		const existingUser = await prisma.user.findUnique({
			where: {
				kindeId: user
			}
		})

		if (!existingUser) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'User not found'
			})
		}

		// Créer le device dans la base de données
		const newDevice = await prisma.device.create({
			data: {
				ownerId: existingUser.id,
				macAddress: device.macAddress,
				name: device.name || null,
			}
		})

		return {
			success: true,
			device: newDevice
		}
	} catch (error) {
		console.error('Error creating device:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: error instanceof Error ? error.message : 'Failed to create device'
		})
	}
})
