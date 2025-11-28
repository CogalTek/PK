import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
	console.log('Received body:', body)
    // Validation
    if (!body || !body.name || !body.deviceId || !body.userId || !body.hour) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'name, deviceId, userId et hour sont requis'
        })
    }

    try {
        // Vérifier que le device existe et appartient à l'utilisateur
        const device = await prisma.device.findUnique({
            where: { id: body.deviceId }
        })
        if (!device) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Device not found'
            })
        }

        // Récupérer l'utilisateur interne
        const user = await prisma.user.findUnique({
            where: { kindeId: body.userId }
        })
        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'User not found'
            })
        }

        // Créer ou trouver le calendar pour cet utilisateur et device
        let calendar = await prisma.calendar.findFirst({
            where: {
                ownerId: user.id,
                name: `WakeOnLan-${device.id}`
            }
        })
        if (!calendar) {
            calendar = await prisma.calendar.create({
                data: {
                    ownerId: user.id,
                    name: `WakeOnLan-${device.id}`
                }
            })
        }

        // Créer les horaires selon la récurrence ou le jour choisi
        let dateTimes = []
        if (body.recurrence) {
            // Tous les jours à la même heure
            for (let d = 0; d < 7; d++) {
                let dt = await prisma.dateTimeSchedule.findFirst({
                    where: {
                        calendarId: calendar.id,
                        hours: body.hour,
                        day: d
                    }
                })
                if (!dt) {
                    dt = await prisma.dateTimeSchedule.create({
                        data: {
                            calendarId: calendar.id,
                            hours: body.hour,
                            day: d
                        }
                    })
                }
                dateTimes.push(dt)
            }
        } else {
            // Un seul jour précis
            let dt = await prisma.dateTimeSchedule.findFirst({
                where: {
                    calendarId: calendar.id,
                    hours: body.hour,
                    day: body.day
                }
            })
            if (!dt) {
                dt = await prisma.dateTimeSchedule.create({
                    data: {
                        calendarId: calendar.id,
                        hours: body.hour,
                        day: body.day
                    }
                })
            }
            dateTimes.push(dt)
        }

        // Créer la tâche WakeOnLan liée au calendar
        const cron = await prisma.wakeOnLan.create({
            data: {
                ownerId: user.id,
                name: body.name,
                description: body.description || null,
                deviceId: body.deviceId,
                calendarId: calendar.id
            }
        })

        return {
            success: true,
            cron,
            dateTimes
        }
    } catch (error) {
        console.error('Error creating cron:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Failed to create cron'
        })
    }
})
