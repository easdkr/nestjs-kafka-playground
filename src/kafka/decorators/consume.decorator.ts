import { SetMetadata } from '@nestjs/common';
import { KAFKA_MODULE_CONSUME } from '../kafka.constants';

export type ConsumeOption = string | { topic: string };

export const Consume = (option: ConsumeOption) =>
  SetMetadata(
    KAFKA_MODULE_CONSUME,
    typeof option === 'string' ? option : option.topic,
  );
