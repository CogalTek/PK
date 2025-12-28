import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const id = getRouterParam(event, 'id') as string
    const status = body.status as boolean

    const updatedTodo = await prisma.todo.update({
        where: {
            id: id
        },
        data: {
            status: status
        }
    })

    return {
        success: true,
        todo: updatedTodo
    }
})
