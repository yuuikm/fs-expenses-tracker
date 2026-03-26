import { Injectable } from '@nestjs/common';
import type { SendOtpRequest } from '@yuuik/contracts/gen/auth';
import { AuthRepository } from '@/modules/auth/auth.repository';
import { Account } from '../../../prisma/generated/client';
import { OtpService } from '@/modules/otp/otp.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly authRepository: AuthRepository,
    private readonly otpService: OtpService,
  ) {}

  public async sendOtp(data: SendOtpRequest) {
    const { identifier, type } = data;

    let account: Account | null;

    if (type === 'phone')
      account = await this.authRepository.findByPhone(identifier);
    else account = await this.authRepository.findByEmail(identifier);

    if (!account) {
      account = await this.authRepository.createAccount({
        phone: type === 'phone' ? identifier : undefined,
        email: type === 'email' ? identifier : undefined,
      });
    }

    const code = await this.otpService.send(
      identifier,
      type as 'phone' | 'email',
    );

    console.debug('CODE: ', code);

    return { ok: true };
  }
}
