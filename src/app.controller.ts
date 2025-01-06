import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SendMessageDto } from './dto/sendMessage.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint for sending a message to a Kafka topic.
   * Receives the topic and message from the request body.
   * @param payload - The request body containing the topic and message.
   * @returnsA promise that resolves to an object containing information about the production result.
   */
  @Get()
  sendMessage(@Body() payload: SendMessageDto) {
    return this.appService.sendMessage(payload.topic, payload.message);
  }
}
