import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Module({
  exports: [ProducerService],
  providers: [ProducerService],
})
export class KafkaModule {}
