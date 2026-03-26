import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthClientGrpc } from './auth.grpc';
import { join } from 'node:path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth.v1',
          protoPath: join(
            process.cwd(),
            'node_modules/@yuuik/contracts/proto/auth.proto',
          ),
          url: process.env.AUTH_GRPC_URL ?? 'localhost:50051',
          loader: {
            keepCase: false,
            longs: String,
            enums: String,
            default: true,
            oneofs: true,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthClientGrpc],
})
export class AuthModule {}
