import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'
import * as path from 'path'

const environment = process.env.NODE_ENV || 'dev'
config({
	path: path.resolve(__dirname, '..', `.env.${environment}`)
})

const databaseUrl =
	process.env.IS_DOCKER === 'true'
		? process.env.DATABASE_URL
		: process.env.DATABASE_URL?.replace('@postgres:', '@localhost:')

export default defineConfig({
	schema: 'prisma/schema.prisma',

	migrations: {
		path: 'prisma/migrations'
	},

	datasource: {
		url: databaseUrl
	}
})

