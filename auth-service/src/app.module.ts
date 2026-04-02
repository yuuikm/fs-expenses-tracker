import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@/infrastructure/redis/redis.module';
import { OtpModule } from './modules/otp/otp.module';
import { databaseEnv, grpcEnv, passportEnv, redisEnv } from '@/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseEnv, grpcEnv, passportEnv, redisEnv],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    OtpModule,
  ],
})
export class AppModule {}
