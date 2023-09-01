import { Logger } from '@nestjs/common';
import { Consume, Consumer } from '../kafka/decorators';

@Consumer({ groupId: 'my-app-consumer' })
export class ConsumerService {
  logger = new Logger();

  @Consume('june')
  async consume(message) {
    this.logger.log(message);
  }

  @Consume({ topic: 'test' })
  async test(message) {
    this.logger.verbose(message);
  }
}
