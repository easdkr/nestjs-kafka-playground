import { DynamicModule, Module } from '@nestjs/common';
import { createKafkaProvider } from './kafka.provider';
import { Producer } from './kafka.producer';
import { DiscoveryModule } from '@nestjs/core';
import { KafkaExplorer } from './kafka.explorer';
import { KafkaMetadataAccessor } from './kafka-metadata.accessor';
import { Processor } from './kafka.processor';
import { KafkaConfig } from 'kafkajs';

@Module({})
export class KafkaModule {
  static register(options: KafkaConfig): DynamicModule {
    return {
      imports: [DiscoveryModule],
      global: true,
      module: KafkaModule,
      providers: [
        createKafkaProvider({ ...options }),
        Producer,
        Processor,
        KafkaMetadataAccessor,
        KafkaExplorer,
      ],
      exports: [Producer],
    };
  }
}
