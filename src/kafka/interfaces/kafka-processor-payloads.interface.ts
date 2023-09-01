/* eslint-disable @typescript-eslint/ban-types */
export interface KafkaProcessor {
  groupId: string;
  allowAutoTopicCreation: boolean;
  tasks: { [topic: string]: Function };
}
