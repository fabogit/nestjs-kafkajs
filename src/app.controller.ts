import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

export class SendMessageDto {
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sendMessage(@Body() payload: SendMessageDto) {
    return this.appService.produceMessage(payload.message);
  }
}
