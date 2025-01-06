import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async produceMessage(message: string) {
    this.producerService.produce({
      topic: 'producerTopic',
      messages: [
        {
          value: message,
        },
      ],
    });
  }
}
