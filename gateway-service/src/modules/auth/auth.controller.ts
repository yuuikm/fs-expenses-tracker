import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { SendOtpRequest, VerifyOtpRequest } from './dto';
import { AuthClientGrpc } from './auth.grpc';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authClientGrpc: AuthClientGrpc,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Send otp code',
    description: 'Sends verification code to the user phone or email',
  })
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  public async sendOtp(@Body() dto: SendOtpRequest) {
    console.log(dto);

    return await firstValueFrom(this.authClientGrpc.sendOtp(dto));
  }

  @ApiOperation({
    summary: 'Verify otp code',
    description: 'Verify verification code from the user phone or email',
  })
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  public async verifyOtp(
    @Body() dto: VerifyOtpRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await lastValueFrom(
      this.authClientGrpc.verifyOtp(dto),
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') !== 'development',
      domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 1000,
    });

    return { accessToken };
  }
}
