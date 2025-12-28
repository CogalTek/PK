import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id') as string

    await prisma.todo.delete({
        where: {
            id: id
        }
    })

    return {
        success: true
    }
})
