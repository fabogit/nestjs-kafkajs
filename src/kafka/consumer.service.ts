import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import {
  Kafka,
  Consumer,
  ConsumerSubscribeTopics,
  ConsumerRunConfig,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly logger = new Logger(ConsumerService.name, {
    timestamp: true,
  });
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private readonly consumers: Consumer[] = [];

  // disconnect consumers on shoutdown
  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Receivied signal: ${signal}`);
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'nestjs-kafkajs' });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
}
