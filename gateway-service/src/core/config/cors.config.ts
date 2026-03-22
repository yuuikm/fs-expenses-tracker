import { ConfigService } from '@nestjs/config';
import type { CorsOptions } from '@nestjs/common/internal';

export function getCorsConfig(configService: ConfigService): CorsOptions {
  return {
    origin: configService.getOrThrow<string>('HTTP_CORS').split(','),
    credentials: true,
  };
}
