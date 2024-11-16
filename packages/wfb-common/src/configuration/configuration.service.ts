import { Injectable } from '@nestjs/common';

import { Config } from './configuration.types';

@Injectable()
export class ConfigurationService {
    constructor(private readonly config: Config) {}

    getConfig() {
        return this.config;
    }
}
