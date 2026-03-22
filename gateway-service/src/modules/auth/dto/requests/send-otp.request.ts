import { IsEnum, IsString, Validate } from 'class-validator';
import { IdentifierValidator } from 'src/shared/validators';

export class SendOtpRequest {
  @IsString()
  @Validate(IdentifierValidator)
  public identifier: string;

  @IsEnum(['phone', 'email'])
  public type: 'phone' | 'email';
}
