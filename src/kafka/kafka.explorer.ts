/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { KafkaMetadataAccessor } from './kafka-metadata.accessor';
import { Processor } from './kafka.processor';
import { KafkaProcessor } from './interfaces';

@Injectable()
export class KafkaExplorer implements OnModuleInit {
  public constructor(
    private readonly processor: Processor,
    private readonly discovery: DiscoveryService,
    private readonly metadataAccessor: KafkaMetadataAccessor,
  ) {}

  public async onModuleInit() {
    await this.#explore();
  }

  async #explore() {
    await this.discovery
      .getProviders()
      .filter((w) => w.isDependencyTreeStatic())
      .filter(({ instance }) => !!instance && Object.getPrototypeOf(instance))
      .filter(({ metatype, instance }) =>
        this.metadataAccessor.isKafkaComponent(metatype || instance),
      )
      .map(({ metatype, instance }) =>
        this.metadataAccessor.getKafkaProcessorPayloads(metatype, instance),
      )
      .reduce<KafkaProcessor[]>(this.#mergeProcessorPayloads, [])
      .map(async ({ groupId, allowAutoTopicCreation, tasks }) => {
        await this.processor.create({ groupId, allowAutoTopicCreation, tasks });
      });
  }

  #mergeProcessorPayloads = (
    acc: KafkaProcessor[],
    processor: KafkaProcessor,
  ): KafkaProcessor[] => {
    const existingConsumer = acc.find((c) => c.groupId === processor.groupId);

    if (existingConsumer) {
      existingConsumer.allowAutoTopicCreation =
        existingConsumer.allowAutoTopicCreation ||
        processor.allowAutoTopicCreation;
      existingConsumer.tasks = {
        ...existingConsumer.tasks,
        ...processor.tasks,
      };
    } else {
      acc.push(processor);
    }

    return acc;
  };
}
