import { Injectable } from '@nestjs/common';

import { WfbException, ErrorCode } from '../exceptions';
import { LoggerFactory } from '../logger';
import { ApplicationSettingsDbService, UserDbService, WorkspaceDbService } from '../odm';
import { REQUEST_CONTEXT_DATA_TYPES, RequestContext } from '../types';

@Injectable()
export class DataFromContext {
    private readonly logger = LoggerFactory.getLogger('EnrichContext');

    constructor(
        private readonly userDbService: UserDbService,
        private readonly workspaceDbService: WorkspaceDbService,
        private readonly applicationSettingsDbService: ApplicationSettingsDbService,
    ) {
        this.logger.debug('DataFromContext: initialize');
    }

    protected async _enrichWithUserData(context: RequestContext) {
        const { accountId, userId } = context;
        const userData = await this.userDbService.findOne(context, {
            condition: {
                accountId,
                userId,
            },
        });
        context.user = userData;
        return context;
    }

    protected async _enrichWithAppSettingsData(context: RequestContext) {
        const { accountId } = context;
        const appSettingsData = await this.applicationSettingsDbService.findOne(context, {
            condition: {
                accountId,
            },
        });
        context.applicationSettings = appSettingsData;
        return context;
    }

    protected async _enrichWithWorkspaceData(context: RequestContext, workspaceId: string) {
        const { accountId } = context;
        const workspaceData = await this.workspaceDbService.findOne(context, {
            condition: {
                accountId,
                workspaceId,
            },
        });
        context.workspace = workspaceData;
        return context;
    }

    async get(context: RequestContext, data: { workspaceId?: string; type: string }): Promise<RequestContext> {
        try {
            const { type, workspaceId } = data;
            const { user, workspace, applicationSettings } = context;

            const enrichmentFunctions = {
                [REQUEST_CONTEXT_DATA_TYPES.USER]: async () => {
                    if (!user || Object.keys(user).length === 0) {
                        context = await this._enrichWithUserData(context);
                    }
                },
                [REQUEST_CONTEXT_DATA_TYPES.WORKSPACE]: async () => {
                    if (!workspace || Object.keys(workspace).length === 0) {
                        context = await this._enrichWithWorkspaceData(context, workspaceId);
                    }
                },
                [REQUEST_CONTEXT_DATA_TYPES.APPLICATION_SETTINGS]: async () => {
                    if (!applicationSettings || Object.keys(applicationSettings).length === 0) {
                        context = await this._enrichWithAppSettingsData(context);
                    }
                },
            };

            if (enrichmentFunctions[type]) {
                await enrichmentFunctions[type]();
            }

            return context;
        } catch (error) {
            throw new WfbException(ErrorCode.ENRICH_CONTEXT_ERROR, {
                cause: error,
                details: {
                    data,
                },
            });
        }
    }
}
