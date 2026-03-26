import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { IdentifierValidator } from 'src/shared/validators';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpRequest {
  @IsString()
  @Validate(IdentifierValidator)
  @ApiProperty({
    example: 'morozov-mark@bk.ru',
  })
  public identifier: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @IsNumberString()
  @Length(6, 6)
  public code: string;

  @IsEnum(['phone', 'email'])
  @ApiProperty({
    example: 'email',
  })
  public type: 'phone' | 'email';
}
