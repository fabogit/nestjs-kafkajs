import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ProducerTopicConsumer } from './kafka/producerTopic.consumer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), KafkaModule],
  controllers: [AppController],
  providers: [AppService, ProducerTopicConsumer],
})
export class AppModule {}
