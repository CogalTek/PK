import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Cron ID is required'
        })
    }

    try {
        // Vérifier que la tâche cron existe
        const cron = await prisma.wakeOnLan.findUnique({
            where: { id },
            include: { calendar: true }
        })

        if (!cron) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Cron not found'
            })
        }

        // Supprimer la tâche cron
        await prisma.wakeOnLan.delete({
            where: { id }
        })

        // Optionnel : Supprimer le calendar s'il n'est plus utilisé par d'autres WakeOnLan
        if (cron.calendarId) {
            const remainingCrons = await prisma.wakeOnLan.count({
                where: { calendarId: cron.calendarId }
            })

            if (remainingCrons === 0) {
                await prisma.calendar.delete({
                    where: { id: cron.calendarId }
                })
            }
        }

        return {
            success: true,
            message: 'Cron deleted successfully'
        }
    } catch (error) {
        console.error('Error deleting cron:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Failed to delete cron'
        })
    }
})
