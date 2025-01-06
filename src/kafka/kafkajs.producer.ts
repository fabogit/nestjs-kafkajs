import { Logger } from '@nestjs/common';
import { Kafka, Producer, Message } from 'kafkajs';
import { IProducer } from './interfaces/producer.interface';
import { sleep } from 'src/utils/sleep';

/**
 * A Kafka producer implementation using the `kafkajs` library.
 * Implements the {@link IProducer} interface.
 */
export class KafkajsProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger;

  /**
   * Creates a new KafkajsProducer instance.
   * @param topic - The topic to produce messages to.
   * @param broker - The Kafka broker address.
   */
  constructor(
    private readonly topic: string,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.producer = this.kafka.producer();
    this.logger = new Logger(topic);
  }

  /**
   * Connects the producer to the Kafka cluster.
   * Implements retry logic in case of connection failures.
   * @returns A promise that resolves when the connection is established.
   */
  async connect() {
    try {
      await this.producer.connect();
    } catch (err) {
      const timeout = 5000;
      this.logger.error(
        `Failed to connect producer to Kafka, retying in ${timeout / 1000}sec`,
        err,
      );
      // recursively retry to connect
      await sleep(timeout);
      await this.connect();
    }
  }

  /**
   * Disconnects the producer from the Kafka cluster.
   * @returns A promise that resolves when the producer is disconnected.
   */
  async disconnect() {
    await this.producer.disconnect();
  }

  /**
   * Sends a message to the specified Kafka topic.
   * @param message - The message to send. This should be a valid `kafkajs` Message object.
   * @returns A promise that resolves when the message is sent.
   */
  async produce(message: Message) {
    await this.producer.send({ topic: this.topic, messages: [message] });
  }
}
