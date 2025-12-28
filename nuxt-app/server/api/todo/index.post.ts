import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const kindeId = body.kindeId as string
    const name = body.name as string

    const user = await prisma.user.findUnique({
        where: {
            kindeId: kindeId
        }
    })

    const todo = await prisma.todo.create({
        data: {
            name: name,
            ownerId: user?.id
        }
    })

    return {
        todo
    }
})
