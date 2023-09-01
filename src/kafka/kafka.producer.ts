import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer as KafkaJsProducer, Partitioners } from 'kafkajs';

@Injectable()
export class Producer implements OnModuleInit, OnModuleDestroy {
  #producer: KafkaJsProducer;

  constructor(private readonly kafka: Kafka) {
    this.#producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }

  async onModuleInit() {
    await this.#producer.connect();
  }

  async onModuleDestroy() {
    await this.#producer.disconnect();
  }

  async send(topic: string, kafkaMessage: string | Buffer) {
    return await this.#producer.send({
      topic,
      messages: [{ value: JSON.stringify(kafkaMessage) }],
    });
  }
}
