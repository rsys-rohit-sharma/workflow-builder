import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ApplicationBusinessHour,
    ApplicationBusinessHourDocument,
    ApplicationBusinessHourFields,
    ApplicationBusinessHourFieldsQueryConditionType,
} from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class ApplicationBusinessHourDbService extends BaseDbService<
    ApplicationBusinessHourFields,
    ApplicationBusinessHour,
    ApplicationBusinessHourFieldsQueryConditionType,
    ApplicationBusinessHourFieldsQueryConditionType
> {
    constructor(
        @InjectModel(ApplicationBusinessHour.name)
        private readonly applicationBusinessHourModel: Model<ApplicationBusinessHourDocument>,
    ) {
        super(applicationBusinessHourModel);
    }
}
