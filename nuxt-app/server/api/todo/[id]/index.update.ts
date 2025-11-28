import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const id = query.id as string

    await prisma.todo.delete({
        where: {
            id: id
        }
    })

    return {
        success: true
    }
})
