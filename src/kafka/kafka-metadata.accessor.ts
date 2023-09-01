/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, Type } from '@nestjs/common';
import { MetadataScanner, Reflector } from '@nestjs/core';
import { KAFKA_MODULE_CONSUME, KAFKA_MODULE_CONSUMER } from './kafka.constants';
import { ConsumerOptions } from './decorators';

type Target = Function | Type<any>;

@Injectable()
export class KafkaMetadataAccessor {
  public constructor(
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  public isKafkaComponent(target: Target): boolean {
    return !!this.reflector.get(KAFKA_MODULE_CONSUMER, target);
  }

  public isKafkaConsume(target: Target): boolean {
    return !!this.reflector.get(KAFKA_MODULE_CONSUME, target);
  }

  public getKafkaComponentMetadata(target: Target): any {
    return this.reflector.get(KAFKA_MODULE_CONSUMER, target);
  }

  public getKafkaConsumeMetadata(target: Target): any {
    return this.reflector.get(KAFKA_MODULE_CONSUME, target);
  }

  public getKafkaProcessorPayloads(metatype: Target, instance: Target): any {
    const componentMetadata = this.getKafkaComponentMetadata(
      metatype,
    ) as ConsumerOptions;

    const tasks = this.metadataScanner
      .getAllMethodNames(instance)
      .filter((methodName) => this.isKafkaConsume(instance[methodName]))
      .map((methodName) => {
        const metadata = this.getKafkaConsumeMetadata(instance[methodName]);
        return {
          method: instance[methodName].bind(instance),
          topic: metadata,
        };
      })
      .reduce<Record<string, Function>>((acc, { method, topic }) => {
        acc[topic] = method;
        return acc;
      }, {});

    return {
      groupId: componentMetadata.groupId,
      allowAutoTopicCreation: componentMetadata.allowAutoTopicCreation,
      tasks,
    };
  }
}
