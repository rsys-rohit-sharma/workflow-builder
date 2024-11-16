import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    AgentGroupMembership,
    AgentGroupMembershipDocument,
    AgentGroupMembershipFields,
    AgentGroupMembershipQueryConditionType,
} from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class AgentGroupMembershipDbService extends BaseDbService<
    AgentGroupMembershipFields,
    AgentGroupMembership,
    AgentGroupMembershipQueryConditionType,
    AgentGroupMembershipQueryConditionType
> {
    constructor(
        @InjectModel(AgentGroupMembership.name)
        private readonly agentGroupMembershipModel: Model<AgentGroupMembershipDocument>,
    ) {
        super(agentGroupMembershipModel);
    }
}
