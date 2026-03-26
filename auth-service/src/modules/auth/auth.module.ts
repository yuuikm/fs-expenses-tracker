import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthRepository } from '@/modules/auth/auth.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
