import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/kafka.producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  /**
   * Sends a message to a specified Kafka topic using the ProducerService.
   * Logs the sent message to the console. Throws an error if the message production fails.
   * @param topic - The name of the Kafka topic to send the message to.
   * @param message - The message content to send.
   * @returns A promise that resolves to an object confirming successful production.
   * @throws If an error occurs during message production, an Error object is thrown.
   */
  async sendMessage(topic: string, message: string) {
    try {
      await this.producerService.produce(topic, { value: message });
      return { message: 'Message emitted' };
    } catch (err) {
      throw new Error(err);
    }
  }
}
