import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientType, FFClient, Target } from '@simpplr/ff-node-server-sdk';

import { FeatureFlag } from '../constants';
import { WfbException, ErrorCode } from '../exceptions';
import { LoggerFactory } from '../logger';
import { Configurable, Initiable } from '../types';
import { FFTargetContext, HarnessConfig } from './harness.types';

@Injectable()
export class HarnessService implements Initiable, OnModuleInit, Configurable<HarnessConfig> {
    private readonly logger = LoggerFactory.getLogger(HarnessService.name);

    config: HarnessConfig;
    isInitialized = false;

    constructor(private ffClient: FFClient) {}

    async onModuleInit() {
        if (process.env.LOCAL === 'true') {
            return;
        }

        await this.initialize();
        this.logger.debug('onModuleInit');
    }

    async configure(config: HarnessConfig): Promise<this> {
        this.config = config;
        return this.initialize();
    }

    async initialize(): Promise<this> {
        if (this.isInitialized) {
            return this;
        }

        try {
            this.ffClient = await this.ffClient.init({
                type: ClientType.HARNESS,
                sdkKey: this.config.sdkKey,
            });
            this.isInitialized = true;

            LoggerFactory.updateLogger();

            this.ffClient.addChangeListener(async () => LoggerFactory.updateLogger());
            this.logger.debug('initialized');
            return this;
        } catch (error) {
            throw new WfbException(ErrorCode.UNEXPECTED_ERROR, { cause: error });
        }
    }

    protected _buildTarget(context: FFTargetContext): Target {
        let target: Target;
        if (context?.req) {
            target = { req: context.req };
        } else if (context?.reqContext) {
            const { accountId, userId, feHost, host } = context.reqContext;
            target = {
                userId,
                feHost,
                host,
                tenantId: accountId,
            };
        }
        return target;
    }

    async getBooleanFlagValue(
        featureFlag: FeatureFlag,
        context?: FFTargetContext,
        defaultValue = false,
    ): Promise<boolean> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const target = this._buildTarget(context);
        const evaluation = await this.ffClient.evaluateBooleanFlag(featureFlag, defaultValue, target);

        this.logger.debug(`String Feature flag evaluated ${featureFlag}: ${evaluation}`);

        return !!evaluation;
    }

    async getStringFlagValue(featureFlag: FeatureFlag, context?: FFTargetContext, defaultValue = ''): Promise<string> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const target = this._buildTarget(context);
        const evaluation = await this.ffClient.evaluateStringFlag(featureFlag, defaultValue, target);

        this.logger.debug(`String Feature flag evaluated ${featureFlag}: ${evaluation}`);
        console.log(`String Feature flag evaluated ${featureFlag}: ${evaluation}`);

        return evaluation;
    }
}
