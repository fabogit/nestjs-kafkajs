import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProducerService } from './kafka.producer.service';
import { ConsumerService } from './kafka.consumer.service';

@Module({
  imports: [DatabaseModule],
  exports: [ProducerService, ConsumerService],
  providers: [ProducerService, ConsumerService],
})
export class KafkaModule {}
