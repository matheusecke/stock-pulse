import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      message: 'API is running successfully',
      timestamp: new Date().toISOString(),
      service: 'StockPulse Backend',
    };
  }

  @Get('ping')
  ping() {
    return { pong: true };
  }
}
