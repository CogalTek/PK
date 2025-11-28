import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

let prisma: PrismaClient

declare global {
	var __prisma: PrismaClient | undefined
}

if (!global.__prisma) {
	const pool = new pg.Pool({
		connectionString: process.env.DATABASE_URL,
	})
	const adapter = new PrismaPg(pool)
	global.__prisma = new PrismaClient({ adapter })
}

prisma = global.__prisma

export default prisma
