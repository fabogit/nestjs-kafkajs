import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka.consumer.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
  private readonly logger = new Logger(TestConsumer.name, {
    timestamp: true,
  });
  constructor(private readonly consumerService: ConsumerService) {}

  /**
   * Implementation of the OnModuleInit lifecycle hook.
   * Subscribes to the topic on application initialization.
   * @inheritdoc {@link OnModuleInit} ModuleInit
   */
  async onModuleInit() {
    await this.consumerService.consume({
      topic: { topics: ['testTopic'] },
      config: { groupId: 'test-consumer' },
      /**
       * Callback function invoked for each received message.
       * Logs the message value with debug level and throws an error for testing purposes (commented out).
       * @param message - The received message object.
       */
      onMessage: async (message) => {
        this.logger.debug(message.value.toString());
        // Test error handling
        // throw new Error('Testing error! ');
      },
    });
  }
}
