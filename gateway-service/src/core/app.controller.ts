import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HealthResponse } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Welcome enpoint',
    description: 'Returns simple api welcome message',
  })
  @Get()
  public getHello() {
    return this.appService.getHello();
  }

  @ApiOperation({
    summary: 'Health enpoint',
    description: 'Returns health status',
  })
  @ApiOkResponse({
    type: HealthResponse,
  })
  @Get('health')
  public health() {
    return this.appService.health();
  }
}
