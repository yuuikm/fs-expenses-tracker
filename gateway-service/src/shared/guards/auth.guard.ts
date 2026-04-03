import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PassportService } from '@yuuik/passport';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly passportService: PassportService) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('Token not provided');

    const result = this.passportService.verifyToken(token);
    8;
    if (!result.valid) throw new UnauthorizedException(result.reason);

    request.user = {
      id: result.userId,
    };

    return true;
  }

  private extractToken(request: Request) {
    const header = request.headers.authorization;

    if (!header)
      throw new UnauthorizedException('Authorization header required');

    if (!header.startsWith('Bearer '))
      throw new UnauthorizedException('Invalid authorization');

    const token = header.replace(/^Bearer\s+/i, '').trim();

    return token;
  }
}
