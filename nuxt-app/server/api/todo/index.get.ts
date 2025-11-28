import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const kindeId = query.userId as string

    const user = await prisma.user.findUnique({
        where: {
            kindeId: kindeId
        },
        include: {
            todos: true
        }
    })

    return {
        user
    }
})
