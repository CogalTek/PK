import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const kindeId = body.userId as string
    const name = body.name as string
    const description = body.description as string || ""

    const user = await prisma.user.findUnique({
        where: {
            kindeId: kindeId
        },
        include: {
            todos: true
        }
    })

    const todo = await prisma.todo.create({
        data: {
            name: name,
            description: description,
            ownerId: kindeId
        }
    })

    return {
        todo
    }
})
