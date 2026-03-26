import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendOtpRequest } from './dto';
import { AuthClientGrpc } from './auth.grpc';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authClientGrpc: AuthClientGrpc) {}

  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  public async sendOtp(@Body() dto: SendOtpRequest) {
    console.log(dto);

    return await firstValueFrom(this.authClientGrpc.sendOtp(dto));
  }
}
