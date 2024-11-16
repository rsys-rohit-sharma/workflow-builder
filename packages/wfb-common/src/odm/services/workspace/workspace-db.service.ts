import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Workspace, WorkspaceDocument, WorkspaceFields, WorkspaceFieldsQueryConditionType } from '../../models';
import { BaseDbService } from '../base-db.service';

@Injectable()
export class WorkspaceDbService extends BaseDbService<
    WorkspaceFields,
    Workspace,
    WorkspaceFieldsQueryConditionType,
    WorkspaceFieldsQueryConditionType
> {
    constructor(
        @InjectModel(Workspace.name)
        private readonly workspaceModel: Model<WorkspaceDocument>,
    ) {
        super(workspaceModel);
    }
}
