import { Module } from '@nestjs/common';
import { ProducerService } from './kafka.producer.service';
import { ConsumerService } from './kafka.consumer.service';

@Module({
  exports: [ProducerService, ConsumerService],
  providers: [ProducerService, ConsumerService],
})
export class KafkaModule {}
