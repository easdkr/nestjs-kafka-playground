import { Consume, Consumer } from '../kafka/decorators';

const getTopicTable = (prefix: string) => `${prefix}-table`;

@Consumer({ groupId: 'my-app-consumer', allowAutoTopicCreation: false })
export class Consumer2Service {
  @Consume(getTopicTable('june'))
  async consume(message) {
    console.log(message);
  }
}
