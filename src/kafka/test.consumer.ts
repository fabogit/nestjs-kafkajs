import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka.consumer.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
  private readonly logger = new Logger(TestConsumer.name, {
    timestamp: true,
  });
  constructor(private readonly consumerService: ConsumerService) {}

  // subscribe on the topic on init
  async onModuleInit() {
    await this.consumerService.consume({
      topic: { topics: ['testTopic'] },
      config: { groupId: 'test-consumer' },
      onMessage: async (message) => {
        this.logger.debug(message.value.toString());
        // Test error handling
        // throw new Error('Testing error! 💣💥');
      },
    });
  }
}
