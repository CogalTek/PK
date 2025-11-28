import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
	// Récupérer le body de la requête
	const body = await readBody(event)
	console.log(body)
	// Validation
	if (!body) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Request user is required'
		})
	}

	const { id, email, given_name, family_name, picture } = body

	// Validation des champs requis
	if (!id || !email) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'kindeId and email are required'
		})
	}

	const kindeId = id

	try {
		// Upsert: crée l'utilisateur s'il n'existe pas, sinon le met à jour
		const user = await prisma.user.upsert({
			where: {
				kindeId: kindeId
			},
			update: {
				email,
				firstName: given_name || null,
				lastName: family_name || null,
				picture: picture || null,
				updatedAt: new Date()
			},
			create: {
				kindeId,
				email,
				firstName: given_name || null,
				lastName: family_name || null,
				picture: picture || null
			}
		})

		return {
			success: true,
			user
		}
	} catch (error) {
		console.error('Error upserting user:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: error instanceof Error ? error.message : 'Failed to upsert user'
		})
	}
})
