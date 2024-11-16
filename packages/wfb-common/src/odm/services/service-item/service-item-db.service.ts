import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ServiceItem, ServiceItemDocument, ServiceItemFields, ServiceItemFieldsQueryConditionType } from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class ServiceItemDbService extends BaseDbService<
    ServiceItemFields,
    ServiceItem,
    ServiceItemFieldsQueryConditionType,
    ServiceItemFieldsQueryConditionType
> {
    constructor(
        @InjectModel(ServiceItem.name)
        private readonly serviceItemModel: Model<ServiceItemDocument>,
    ) {
        super(serviceItemModel);
    }
}
