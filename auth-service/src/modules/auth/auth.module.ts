import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthRepository } from '@/modules/auth/auth.repository';
import { OtpService } from '@/modules/otp/otp.service';
import { PassportModule } from '@yuuik/passport';
import { ConfigService } from '@nestjs/config';
import { getPassportConfig } from '@/config';

@Module({
  imports: [
    PassportModule.registerAsync({
      useFactory: getPassportConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, OtpService],
})
export class AuthModule {}
