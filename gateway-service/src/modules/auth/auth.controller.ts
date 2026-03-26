import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendOtpRequest, VerifyOtpRequest } from './dto';
import { AuthClientGrpc } from './auth.grpc';
import { firstValueFrom } from 'rxjs';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authClientGrpc: AuthClientGrpc) {}

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
  public async verifyOtp(@Body() dto: VerifyOtpRequest) {
    return await firstValueFrom(this.authClientGrpc.verifyOtp(dto));
  }
}
