import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';
import { EachMessagePayload } from 'kafkajs';

@Injectable()
export class ProducerTopicConsumer implements OnModuleInit {
  private readonly logger = new Logger(ProducerTopicConsumer.name, {
    timestamp: true,
  });
  constructor(private readonly consumerService: ConsumerService) {}

  // subscribe on the topic on init
  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['producerTopic'] },
      {
        eachMessage: async ({
          topic,
          partition,
          message,
        }: EachMessagePayload) => {
          this.logger.log({
            topic: topic.toString(),
            partition: partition.toString(),
            value: message.value.toString(),
          });
        },
      },
    );
  }
}
