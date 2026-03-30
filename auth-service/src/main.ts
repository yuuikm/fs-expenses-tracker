import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import type { AllConfig } from '@/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService<AllConfig>);

  const host = config.get('grpc.host', { infer: true });
  const port = config.get('grpc.port', { infer: true });

  const url = `${host}:${port}`;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth.v1',
      protoPath: 'node_modules/@yuuik/contracts/proto/auth.proto',
      url,
      loader: {
        keepCase: false,
        longs: String,
        enums: String,
        default: true,
        oneofs: true,
      },
    },
  });
  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
