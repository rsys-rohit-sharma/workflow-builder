import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ApplicationPermission,
    ApplicationPermissionDocument,
    ApplicationPermissionFields,
    ApplicationPermissionFieldsQueryConditionType,
} from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class ApplicationPermissionDbService extends BaseDbService<
    ApplicationPermissionFields,
    ApplicationPermission,
    ApplicationPermissionFieldsQueryConditionType,
    ApplicationPermissionFieldsQueryConditionType
> {
    constructor(
        @InjectModel(ApplicationPermission.name)
        private readonly applicationPermissionModel: Model<ApplicationPermissionDocument>,
    ) {
        super(applicationPermissionModel);
    }
}
