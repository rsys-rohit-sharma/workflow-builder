import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from './configuration.service';
import { TestConfig } from './test.config';

describe('ConfigurationService', () => {
    let service: ConfigurationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ConfigurationService,
                    useValue: new ConfigurationService(TestConfig),
                },
            ],
        }).compile();
        service = module.get<ConfigurationService>(ConfigurationService);
    });

    it('should return config', () => {
        expect(service.getConfig()).toStrictEqual(TestConfig);
    });
});
