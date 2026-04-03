import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/shared/guards';

export const Protected = () => applyDecorators(UseGuards(AuthGuard));
