import { IsEnum, IsString, Validate } from 'class-validator';
import { IdentifierValidator } from 'src/shared/validators';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpRequest {
  @IsString()
  @Validate(IdentifierValidator)
  @ApiProperty({
    example: 'morozov-mark@bk.ru',
  })
  public identifier: string;

  @IsEnum(['phone', 'email'])
  @ApiProperty({
    example: 'email',
  })
  public type: 'phone' | 'email';
}
