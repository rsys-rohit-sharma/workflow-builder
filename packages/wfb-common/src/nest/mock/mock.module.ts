import { Module } from '@nestjs/common';

import { CatsController } from './mock-cats.controller';
import { DogsController } from './mock-dog.controller';

@Module({
    controllers: [CatsController, DogsController],
})
class MockAppModule {}

export { MockAppModule };
