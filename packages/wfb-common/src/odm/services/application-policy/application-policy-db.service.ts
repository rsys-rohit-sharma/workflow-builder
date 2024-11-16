import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ApplicationPolicy,
    ApplicationPolicyDocument,
    ApplicationPolicyFields,
    ApplicationPolicyFieldsQueryConditionType,
} from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class ApplicationPolicyDbService extends BaseDbService<
    ApplicationPolicyFields,
    ApplicationPolicy,
    ApplicationPolicyFieldsQueryConditionType,
    ApplicationPolicyFieldsQueryConditionType
> {
    constructor(
        @InjectModel(ApplicationPolicy.name)
        private readonly applicationPolicyModel: Model<ApplicationPolicyDocument>,
    ) {
        super(applicationPolicyModel);
    }
}
