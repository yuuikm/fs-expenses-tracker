import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PROTO_PATH } from '@yuuik/contracts';

import { AuthController } from './auth.controller';
import { AuthClientGrpc } from './auth.grpc';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth.v1',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            protoPath: String(PROTO_PATH.AUTH),
            url: configService.getOrThrow<string>('AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthClientGrpc],
})
export class AuthModule {}
