import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { Message } from 'kafkajs';
import { IProducer } from './interfaces/producer.interface';
import { ConfigService } from '@nestjs/config';
import { KafkajsProducer } from './kafkajs.producer';

/**
 * A service that manages Kafka producers.
 *
 * This service provides a centralized way to create, manage, and disconnect Kafka producers
 * using the `kafkajs` library. Producers are automatically disconnected on application shutdown.
 */
@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly logger = new Logger(ProducerService.name, {
    timestamp: true,
  });
  /**
   * A map that stores active producers keyed by their topic name.
   */
  private readonly producers = new Map<string, IProducer>();
  constructor(private readonly configService: ConfigService) {}

  /**
   * Sends a message to a specific Kafka topic.

   * This method retrieves a producer for the specified topic (creating a new one if it doesn't exist)
   * and then uses it to send the provided message.
   * @param topic - The name of the Kafka topic to send the message to.
   * @param message - The message to be sent. This should be a valid `kafkajs` Message object.
   * @returns A promise that resolves when the message is sent successfully.
   */
  async produce(topic: string, message: Message) {
    const producer = await this.getProducer(topic);
    await producer.produce(message);
  }

  /**
   * Retrieves or creates a Kafka producer for a specific topic.
   *
   * This method checks the internal map of producers. If a producer for the given topic already exists,
   * it is returned. Otherwise, a new `KafkajsProducer` instance is created, connected, and added to the map.
   * @param topic - The name of the Kafka topic for which to retrieve or create a producer.
   * @returns A promise that resolves to the producer instance for the specified topic.
   */
  private async getProducer(topic: string): Promise<IProducer> {
    let producer = this.producers.get(topic);
    if (!producer) {
      producer = new KafkajsProducer(
        topic,
        this.configService.get('KAFKA_BROKER'),
      );
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  /**
   * Disconnects all active producers when the application shuts down.
   *
   * This method is invoked by Nest when the application is shutting down.
   * It iterates over all producers stored in the map and disconnects them.
   * @param signal - The signal that triggered the application shutdown (optional).
   * @returns A promise that resolves when all producers are disconnected.
   */
  async onApplicationShutdown(signal?: string) {
    this.logger.log(
      `Receivied signal: ${signal} disconnecting all producers...`,
    );
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
