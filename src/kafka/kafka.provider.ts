import { Provider } from '@nestjs/common';
import { Kafka, KafkaConfig } from 'kafkajs';

export function createKafkaProvider(options: KafkaConfig): Provider {
  return {
    provide: Kafka,
    useValue: new Kafka(options),
  };
}
