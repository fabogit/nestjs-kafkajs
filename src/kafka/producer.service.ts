import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(ProducerService.name, {
    timestamp: true,
  });
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private readonly producer: Producer = this.kafka.producer();

  // connect producer to server when app starts
  async onModuleInit() {
    await this.producer.connect();
  }

  // disconnect producer on shoutdown
  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Receivied signal: ${signal}`);
    await this.producer.disconnect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }
}
