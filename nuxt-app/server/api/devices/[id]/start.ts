import prisma from '../../../utils/prisma'
import wol from 'wake_on_lan'

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id')

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Device ID is required'
		})
	}

	try {
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

		wol.wake(device.macAddress, (error) => {
			if (error) {
				console.error('❌ Erreur WoL :', error)
			} else {
				console.log('✅ Paquet Wake-on-LAN envoyé à', device.macAddress)
			}
		})

		return {
			success: true,
			message: 'Wake-on-LAN packet sent'
		}
	} catch (error) {
		console.error('Error sending WoL:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: error instanceof Error ? error.message : 'Failed to send Wake-on-LAN'
		})
	}
})
