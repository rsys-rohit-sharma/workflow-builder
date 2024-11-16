import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    WorkspaceMembership,
    WorkspaceMembershipDocument,
    WorkspaceMembershipFields,
    WorkspaceMembershipQueryConditionType,
} from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class WorkspaceMembershipDbService extends BaseDbService<
    WorkspaceMembershipFields,
    WorkspaceMembership,
    WorkspaceMembershipQueryConditionType,
    WorkspaceMembershipQueryConditionType
> {
    constructor(
        @InjectModel(WorkspaceMembership.name)
        private readonly workspaceMembershipModel: Model<WorkspaceMembershipDocument>,
    ) {
        super(workspaceMembershipModel);
    }
}
