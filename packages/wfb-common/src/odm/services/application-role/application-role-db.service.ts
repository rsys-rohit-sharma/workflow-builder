import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ApplicationRole,
    ApplicationRoleDocument,
    ApplicationRoleFields,
    ApplicationRoleFieldsQueryConditionType,
} from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class ApplicationRoleDbService extends BaseDbService<
    ApplicationRoleFields,
    ApplicationRole,
    ApplicationRoleFieldsQueryConditionType,
    ApplicationRoleFieldsQueryConditionType
> {
    constructor(
        @InjectModel(ApplicationRole.name)
        private readonly applicationRoleModel: Model<ApplicationRoleDocument>,
    ) {
        super(applicationRoleModel);
    }
}
