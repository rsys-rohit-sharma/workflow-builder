import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ServiceCategory,
    ServiceCategoryDocument,
    ServiceCategoryFields,
    ServiceCategoryFieldsQueryConditionType,
} from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class ServiceCategoryDbService extends BaseDbService<
    ServiceCategoryFields,
    ServiceCategory,
    ServiceCategoryFieldsQueryConditionType,
    ServiceCategoryFieldsQueryConditionType
> {
    constructor(
        @InjectModel(ServiceCategory.name)
        private readonly serviceCategoryModel: Model<ServiceCategoryDocument>,
    ) {
        super(serviceCategoryModel);
    }
}
