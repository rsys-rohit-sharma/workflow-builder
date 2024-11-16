export class MockedProducer {
    async init() {
        return this;
    }

    closeConnection = jest.fn().mockImplementation(async () => {});

    async sendMessage() {
        return {};
    }
}

export class MockedConsumer {
    async init() {
        return this;
    }

    closeConnection = jest.fn().mockImplementation(async () => {});
}
