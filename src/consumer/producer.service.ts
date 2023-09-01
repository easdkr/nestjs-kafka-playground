import { Injectable } from '@nestjs/common';
import { Producer } from '../kafka/kafka.producer';

@Injectable()
export class ProducerService {
  message = 'hi there?';
  constructor(private readonly producer: Producer) {}
  async produce() {
    return await this.producer.send('june', 'seung june');
  }

  async produce2() {
    return await this.producer.send('test', this.message);
  }
}
