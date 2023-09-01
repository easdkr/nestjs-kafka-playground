import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { Consumer2Service } from './consumer2.service';

@Module({
  providers: [ProducerService, ConsumerService, Consumer2Service],
  controllers: [ConsumerController],
})
export class ConsumerModule {}
