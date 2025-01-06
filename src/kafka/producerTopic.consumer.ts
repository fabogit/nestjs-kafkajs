import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka.consumer.service';

@Injectable()
export class ProducerTopicConsumer implements OnModuleInit {
  private readonly logger = new Logger(ProducerTopicConsumer.name, {
    timestamp: true,
  });
  constructor(private readonly consumerService: ConsumerService) {}

  // subscribe on the topic on init
  async onModuleInit() {
    await this.consumerService.consume({
      topic: { topics: ['producerTestTopic'] },
      config: { groupId: 'test-consumer' },
      onMessage: async (message) => {
        this.logger.debug(message.value.toString());
      },
    });
  }
}
