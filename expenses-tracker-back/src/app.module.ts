import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

const envFileByNodeEnv: Record<string, string> = {
	development: '../.env.dev',
	test: '../.env.test',
	production: '../.env.prod'
}

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				envFileByNodeEnv[process.env.NODE_ENV ?? 'development'] ?? '../.env.dev',
				'../.env'
			]
		})
	]
})
export class AppModule {}
