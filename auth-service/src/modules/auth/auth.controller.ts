import { Controller } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { GrpcMethod } from '@nestjs/microservices';

import type {
  SendOtpRequest,
  SendOtpResponse,
} from '@yuuik/contracts/gen/auth';

@Controller()
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'SendOtp')
  public async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    return await this.authService.sendOtp(data);
  }
}
