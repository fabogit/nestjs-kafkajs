import { Logger } from '@nestjs/common';
import {
  Kafka,
  Consumer,
  ConsumerSubscribeTopics,
  ConsumerConfig,
  KafkaMessage,
} from 'kafkajs';
import * as retry from 'async-retry';
import { sleep } from 'src/utils/sleep';
import { IConsumer } from './interfaces/consumer.interface';
import { DatabaseService } from 'src/database/database.service';

/**
 * A Kafka consumer implementation using the `kafkajs` library.
 * Implements the {@link IConsumer} interface.
 */
export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  /**
   * Creates a new KafkajsConsumer instance.
   * @param topic - The db service used to save DLQ messages.
   * @param topic - The topics to subscribe to.
   * @param config - The consumer configuration options.
   * @param broker - The Kafka broker address.
   */
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly topic: ConsumerSubscribeTopics,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(
      `Topic: ${topic.topics}, GroupId: ${config.groupId}`,
    );
  }

  /**
   * Connects the consumer to the Kafka cluster.
   * This method implements a retry logic in case of connection failures.
   * @returns A promise that resolves when the connection is established.
   */
  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      const timeout = 5000;
      this.logger.error(
        `Failed to connect consumers to Kafka, retying in ${timeout / 1000}sec`,
        err,
      );
      // recursively retry to connect
      await sleep(timeout);
      await this.connect();
    }
  }

  /**
   * Disconnects the consumer from the Kafka cluster.
   * @returns A promise that resolves when the consumer is disconnected.
   */
  async disconnect() {
    await this.consumer.disconnect();
  }

  /**
   * Starts consuming messages from the subscribed topics.
   * This method subscribes to the specified topics and then runs the consumer in a loop,
   * processing each received message through the provided `onMessage` callback.
   * @param onMessage - A callback function that is invoked for each received message.
   *        The callback receives a `KafkaMessage` object as an argument.
   * @returns A promise that resolves when consumption is stopped.
   */
  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await retry(async () => onMessage(message), {
            retries: 3,
            onRetry: (error, attempt) => {
              this.logger.error(
                `Error consuming message, executing retry ${attempt}/3`,
                error,
              );
            },
          });
        } catch (err) {
          this.logger.error(`Error consuming message. Adding to DLQ`, err);
          await this.addMessageToDlq(message);
        }
      },
    });
  }

  private async addMessageToDlq(message: KafkaMessage) {
    await this.databaseService
      .getDbHandle()
      .collection('dlq')
      .insertOne({ value: message.value, topic: this.topic.topics });
  }
}
