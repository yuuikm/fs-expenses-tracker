import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthRepository } from '@/modules/auth/auth.repository';
import { OtpService } from '@/modules/otp/otp.service';
import { PassportModule } from '@yuuik/passport';

@Module({
  imports: [
    PassportModule.register({
      secretKey: '123456',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, OtpService],
})
export class AuthModule {}
