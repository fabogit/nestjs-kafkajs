import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConsumer } from './interfaces/consumer.interface';
import { KafkaConsumerOptions } from './interfaces/kafkajs-consumer-options.interface';
import { KafkajsConsumer } from './kafkajs.consumer';
import { DatabaseService } from 'src/database/database.service';

/**
 * A service that manages Kafka consumers.
 *
 * This service provides methods for creating and managing Kafka consumers
 * using `kafkajs` library. Consumers are automatically
 * disconnected on application shutdown.
 */
@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly logger = new Logger(ConsumerService.name, {
    timestamp: true,
  });
  private readonly consumers: IConsumer[] = [];
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Disconnects all registered consumers when the application shuts down.
   *
   * This method is invoked by Angular when the application is shutting down.
   * It iterates over all registered consumers and disconnects them.
   * @param signal - The signal that triggered the application shutdown.
   * @returns A promise that resolves when all consumers are disconnected.
   */
  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Receivied signal: ${signal} disconnecting consumers...`);
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  /**
   * Starts consuming messages from a Kafka topic.
   *
   * This method creates a new `KafkajsConsumer` instance with the provided configuration
   * and subscribes it to the specified topic. It then starts consuming messages and
   * invokes the provided `onMessage` callback for each received message. Finally, the
   * consumer is registered to be disconnected on application shutdown.
   * @param options - An object containing configuration options for the consumer.
   *        - `topic`: {ConsumerSubscribeTopics} - The topics to subscribe to.
   *        - `config`: {ConsumerConfig} - The consumer configuration options.
   *        - `onMessage`: {function(KafkaMessage): Promise<void>} - A callback function that is invoked for each received message.
   * @returns A promise that resolves when consumption is stopped.
   */
  async consume({ topic, config, onMessage }: KafkaConsumerOptions) {
    const consumer = new KafkajsConsumer(
      this.databaseService,
      topic,
      config,
      this.configService.get('KAFKA_BROKER'),
    );
    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
  }
}
