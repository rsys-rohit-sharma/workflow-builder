import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { ConfigurationModule } from '../configuration';
import { HarnessModule } from '../harness';
import { SecretManagerModule } from '../secret-manager';
import {
    AgentGroup,
    AgentGroupMembership,
    AgentGroupMembershipSchema,
    AgentGroupSchema,
    ApplicationBusinessHour,
    ApplicationBusinessHourSchema,
    ApplicationPermission,
    ApplicationPermissionSchema,
    ApplicationPolicy,
    ApplicationPolicySchema,
    ApplicationRole,
    ApplicationRoleSchema,
    ApplicationSettings,
    ApplicationSettingsSchema,
    FailureLogs,
    FailureLogsSchema,
    ServiceCategory,
    ServiceCategorySchema,
    ServiceItem,
    ServiceItemSchema,
    User,
    UserSchema,
    Workspace,
    WorkspaceMembership,
    WorkspaceMembershipSchema,
    WorkspaceSchema,
} from './models';
import {
    AgentGroupDbService,
    AgentGroupMembershipDbService,
    ApplicationBusinessHourDbService,
    ApplicationPermissionDbService,
    ApplicationPolicyDbService,
    ApplicationRoleDbService,
    ApplicationSettingsDbService,
    DbService,
    FailureLogsDbService,
    MongooseConfigService,
    ServiceCategoryDbService,
    ServiceItemDbService,
    UserDbService,
    WorkspaceDbService,
    WorkspaceMembershipDbService,
} from './services';

mongoose.set('debug', true);

@Global()
@Module({
    imports: [
        ConfigModule,
        ConfigurationModule,
        HarnessModule,
        SecretManagerModule,
        MongooseModule.forRootAsync({
            imports: [SecretManagerModule, HarnessModule],
            useClass: MongooseConfigService,
        }),
        MongooseModule.forFeature([
            { name: Workspace.name, schema: WorkspaceSchema },
            { name: FailureLogs.name, schema: FailureLogsSchema },
            { name: ServiceItem.name, schema: ServiceItemSchema },
            { name: ServiceCategory.name, schema: ServiceCategorySchema },
            { name: User.name, schema: UserSchema },
            { name: ApplicationSettings.name, schema: ApplicationSettingsSchema },
            { name: ApplicationRole.name, schema: ApplicationRoleSchema },
            { name: ApplicationPermission.name, schema: ApplicationPermissionSchema },
            { name: AgentGroup.name, schema: AgentGroupSchema },
            { name: AgentGroupMembership.name, schema: AgentGroupMembershipSchema },
            { name: WorkspaceMembership.name, schema: WorkspaceMembershipSchema },
            {
                name: ApplicationBusinessHour.name,
                schema: ApplicationBusinessHourSchema,
            },
            { name: ApplicationPolicy.name, schema: ApplicationPolicySchema },
        ]),
    ],
    providers: [
        DbService,
        WorkspaceDbService,
        FailureLogsDbService,
        ServiceCategoryDbService,
        ServiceItemDbService,
        UserDbService,
        ApplicationSettingsDbService,
        ApplicationRoleDbService,
        ApplicationPermissionDbService,
        AgentGroupDbService,
        WorkspaceMembershipDbService,
        AgentGroupMembershipDbService,
        ApplicationBusinessHourDbService,
        ApplicationPolicyDbService,
    ],
    exports: [
        DbService,
        WorkspaceDbService,
        FailureLogsDbService,
        ServiceCategoryDbService,
        ServiceItemDbService,
        UserDbService,
        ApplicationSettingsDbService,
        ApplicationRoleDbService,
        ApplicationPermissionDbService,
        AgentGroupDbService,
        WorkspaceMembershipDbService,
        AgentGroupMembershipDbService,
        ApplicationBusinessHourDbService,
        ApplicationPolicyDbService,
        MongooseModule,
    ],
})
export class ODMModule {}
