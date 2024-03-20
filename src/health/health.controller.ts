import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth(@Res() res: Response) {
    res.status(200).send('OK');
  }
}
