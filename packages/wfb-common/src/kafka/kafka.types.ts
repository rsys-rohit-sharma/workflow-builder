import { ParsedIncomingMessage } from '@simpplr/common-message-broker';
import { type Static, Type } from '@sinclair/typebox';

const TopicsObject = Type.Array(Type.String());

export type Message = ParsedIncomingMessage;
export type KafkaMessageHandler = (n: Message) => Promise<void>;
export type Topics = Static<typeof TopicsObject>;
export type ConsumerGroup = string;
