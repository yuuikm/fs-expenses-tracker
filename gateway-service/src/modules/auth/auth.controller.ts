import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SendOtpRequest, VerifyOtpRequest } from './dto';
import { AuthClientGrpc } from './auth.grpc';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { CurrentUser, Protected } from '@/shared/decorators';

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

  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Renews access token using refresh token from cookies',
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = (req.cookies as Record<string, string>)?.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } = await lastValueFrom(
      this.authClientGrpc.refresh({ refreshToken }),
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') !== 'development',
      domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 1000,
    });

    return { accessToken };
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Clears refresh token cookie and logout user',
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') !== 'development',
      domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
      sameSite: 'lax',
      expires: new Date(0),
    });

    return { ok: true };
  }

  @ApiBearerAuth()
  @Protected()
  @Get('account')
  public async getAcount(@CurrentUser() userId: string) {
    return { id: userId };
  }
}
