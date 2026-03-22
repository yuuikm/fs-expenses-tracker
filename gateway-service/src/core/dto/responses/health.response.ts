import { ApiProperty } from '@nestjs/swagger';

export class HealthResponse {
  @ApiProperty({
    example: 'ok',
  })
  public status: string;

  @ApiProperty({
    example: '2026-03-20T03:00:00.007Z',
  })
  @ApiProperty()
  public timestamp: string;
}
