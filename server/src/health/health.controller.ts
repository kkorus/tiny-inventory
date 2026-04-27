import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: 'tiny-inventory-api' })
  service: string;
}

@Controller('health')
@ApiTags('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Liveness/health check for load balancers and Docker',
  })
  @ApiOkResponse({ type: HealthResponseDto })
  getHealth(): HealthResponseDto {
    return { status: 'ok', service: 'tiny-inventory-api' };
  }
}
