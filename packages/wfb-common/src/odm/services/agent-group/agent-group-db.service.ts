import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AgentGroup, AgentGroupDocument, AgentGroupFieldsQueryConditionType, AgentGroupFieldsType } from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class AgentGroupDbService extends BaseDbService<
    AgentGroupFieldsType,
    AgentGroup,
    AgentGroupFieldsQueryConditionType,
    AgentGroupFieldsQueryConditionType
> {
    constructor(
        @InjectModel(AgentGroup.name)
        private readonly agentGroupModel: Model<AgentGroupDocument>,
    ) {
        super(agentGroupModel);
    }
}
