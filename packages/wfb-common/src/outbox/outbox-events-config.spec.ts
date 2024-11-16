import { OutboxEvents } from './outbox-events-config';
import { OutboxKafkaTopics } from './topics';

describe('OutboxEvents Enum', () => {
    it('should have correct values for workspace events', () => {
        expect(OutboxEvents.WORKSPACE_CREATED).toBe('WORKSPACE_CREATED');
        expect(OutboxEvents.WORKSPACE_UPDATED).toBe('WORKSPACE_UPDATED');
        expect(OutboxEvents.WORKSPACE_DELETED).toBe('WORKSPACE_DELETED');
    });
});

describe('OutboxKafkaTopics Enum', () => {
    it('should have correct values for Kafka topics', () => {
        expect(OutboxKafkaTopics.WORKSPACE).toBe('Zeus_Wfb_Workspace');
        expect(OutboxKafkaTopics.WORKSPACE_INTERACTION).toBe('Zeus_Wfb_Workspace_Interaction');
    });
});
