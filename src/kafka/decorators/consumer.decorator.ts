import { SetMetadata } from '@nestjs/common';
import { KAFKA_MODULE_CONSUMER } from '../kafka.constants';

export interface ConsumerOptions {
  /**
   * Create only one consumer for the same groupId
   */
  groupId: string;
  /**
   * AllowAutoTopicCreation value set to true if two objects are different
   */
  allowAutoTopicCreation?: boolean;
}

export const Consumer = ({
  groupId,
  allowAutoTopicCreation = true,
}: ConsumerOptions) =>
  SetMetadata(
    KAFKA_MODULE_CONSUMER,
    { groupId, allowAutoTopicCreation } || true,
  );
