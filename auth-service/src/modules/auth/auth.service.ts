import { Injectable } from '@nestjs/common';
import type {
  RefreshRequest,
  SendOtpRequest,
  VerifyOtpRequest,
} from '@yuuik/contracts/gen/auth';
import { AuthRepository } from '@/modules/auth/auth.repository';
import { Account } from '../../../prisma/generated/client';
import { OtpService } from '@/modules/otp/otp.service';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@yuuik/common';
import { PassportService, TokenPayload } from '@yuuik/passport';
import { ConfigService } from '@nestjs/config';
import type { AllConfigs } from '@/config';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_TTL: number;
  private readonly REFRESH_TOKEN_TTL: number;

  public constructor(
    private readonly configService: ConfigService<AllConfigs>,
    private readonly authRepository: AuthRepository,
    private readonly otpService: OtpService,
    private readonly passportService: PassportService,
  ) {
    this.ACCESS_TOKEN_TTL = this.configService.get('passport.accessTtl', {
      infer: true,
    });
    this.REFRESH_TOKEN_TTL = this.configService.get('passport.refreshTtl', {
      infer: true,
    });
  }

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

  public async verifyOtp(data: VerifyOtpRequest) {
    const { identifier, code, type } = data;

    await this.otpService.verify(identifier, code, type as 'phone' | 'email');

    let account: Account | null;

    if (type === 'phone')
      account = await this.authRepository.findByPhone(identifier);
    else account = await this.authRepository.findByEmail(identifier);

    if (!account)
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        details: 'Account not found',
      });

    if (type === 'phone' && !account.isPhoneVerified)
      await this.authRepository.updateAccount(account.id, {
        isPhoneVerified: true,
      });

    if (type === 'email' && !account.isEmailVerified)
      await this.authRepository.updateAccount(account.id, {
        isEmailVerified: true,
      });

    return this.generateToken(account.id);
  }

  public async refresh(data: RefreshRequest) {
    const { refreshToken } = data;

    const result = this.passportService.verifyToken(refreshToken);

    if (!result.valid) {
      throw new RpcException({
        code: RpcStatus.UNAUTHENTICATED,
        details: result.reason,
      });
    }

    return this.generateToken(result.userId);
  }

  private generateToken(userId: string) {
    const payload: TokenPayload = { sub: userId };

    const accessToken = this.passportService.generateToken(
      String(payload.sub),
      this.ACCESS_TOKEN_TTL,
    );

    const refreshToken = this.passportService.generateToken(
      String(payload.sub),
      this.REFRESH_TOKEN_TTL,
    );

    return { accessToken, refreshToken };
  }
}
