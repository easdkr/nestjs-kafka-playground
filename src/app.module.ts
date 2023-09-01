import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { TestModule } from './test/test.module';
import { ConsumerModule } from './consumer/consumer.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    KafkaModule.register({
      clientId: 'my-app',
      brokers: ['localhost:19092', 'localhost:29092', 'localhost:39092'],
    }),
    ConsumerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
