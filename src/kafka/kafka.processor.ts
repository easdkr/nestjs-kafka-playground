/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer as KafkaJsConsumer } from 'kafkajs';
import { KafkaProcessor } from './interfaces';

@Injectable()
export class Processor implements OnModuleDestroy {
  #consumerQueue: Array<KafkaJsConsumer> = [];
  constructor(private readonly kafka: Kafka) {}

  public async onModuleDestroy() {
    await Promise.all(
      this.#consumerQueue.map((consumer) => consumer.disconnect()),
    );
  }

  public async create({
    groupId,
    allowAutoTopicCreation,
    tasks,
  }: KafkaProcessor) {
    const consumer = this.#createConsumer(groupId, allowAutoTopicCreation);
    await this.#subscribeToTopics(consumer, tasks);
    this.#consumerQueue.push(consumer);
  }

  async #subscribeToTopics(
    consumer: KafkaJsConsumer,
    tasks: { [topic: string]: Function },
  ) {
    await consumer.connect();
    await consumer.subscribe({ topics: Object.keys(tasks) });
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        await tasks[topic](JSON.parse(message.value.toString()));
      },
    });
  }

  #createConsumer(groupId: string, allowAutoTopicCreation: boolean) {
    return this.kafka.consumer({
      groupId,
      allowAutoTopicCreation,
    });
  }
}
