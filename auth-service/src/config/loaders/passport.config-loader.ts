import { ConfigService } from '@nestjs/config';
import type { AllConfigs } from '@/config';
import { PassportOptions } from '@yuuik/passport';

export function getPassportConfig(
  configService: ConfigService<AllConfigs>,
): PassportOptions {
  return {
    secretKey: configService.get('passport.secretKey', { infer: true }),
  };
}
