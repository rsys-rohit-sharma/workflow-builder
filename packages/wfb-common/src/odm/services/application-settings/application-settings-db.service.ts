import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ApplicationSettings,
    ApplicationSettingsDocument,
    ApplicationSettingsFields,
    ApplicationSettingsQueryConditionType,
} from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class ApplicationSettingsDbService extends BaseDbService<
    ApplicationSettingsFields,
    ApplicationSettings,
    ApplicationSettingsQueryConditionType,
    ApplicationSettingsQueryConditionType
> {
    constructor(
        @InjectModel(ApplicationSettings.name)
        private readonly applicationSettingsModel: Model<ApplicationSettingsDocument>,
    ) {
        super(applicationSettingsModel);
    }
}
