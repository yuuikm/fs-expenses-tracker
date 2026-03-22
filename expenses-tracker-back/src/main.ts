import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const backendPort = config.get<number>('BACKEND_PORT') ?? 3000
	const cookiesSecret = config.get<string>('COOKIES_SECRET') ?? 'dev-cookies-secret'
	const allowedOrigin =
		config.get<string>('ALLOWED_ORIGIN') ?? `http://localhost:${config.get<number>('FRONTEND_PORT') ?? 4200}`

	app.use(cookieParser(cookiesSecret))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.enableCors({
		origin: allowedOrigin,
		credentials: true,
		exposeHeaders: ['set-cookie']
	})

	await app.listen(backendPort)
}

void bootstrap()
