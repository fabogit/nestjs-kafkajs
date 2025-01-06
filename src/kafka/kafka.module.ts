import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';

@Module({
  exports: [ProducerService, ConsumerService],
  providers: [ProducerService, ConsumerService],
})
export class KafkaModule {}
