import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHello() {
    return { message: 'Welcome to Odyx' };
  }

  public health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
