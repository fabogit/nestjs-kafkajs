import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ProducerTopicConsumer } from './producerTopic.consumer';

@Module({
  imports: [KafkaModule],
  controllers: [AppController],
  providers: [AppService, ProducerTopicConsumer],
})
export class AppModule {}
