import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const userId = query.userId

	if (!userId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Bad Request',
			message: 'Missing userId header'
		})
	}

	const user = await prisma.user.findUnique({
		where: {
			kindeId: userId
		},
		include: {
			todos: true
		}
	})

	// const todos = user.todos
	console.log(user)
	const todo = user.todos
	if (todo)
		return { todo }
	return { sucess: false }
})
