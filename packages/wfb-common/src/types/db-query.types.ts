import { SortOrder } from 'mongoose';

export type QueryParamsWithoutCondition<FieldType> = {
    includeAllAttributes?: boolean;
    includedAttributes?: FieldType[];
    excludedAttributes?: FieldType[];
    sortBy?: { field: FieldType; order: SortOrder }[];
    pageNumber?: number;
    resultsPerPage?: number;
    paginate?: boolean;
    offset?: {
        field: FieldType;
        value: unknown;
        operator: 'gt' | 'lt' | 'gte' | 'lte';
    };
};

export type PopulateParam = {
    path: string;
    model: string;
    select: string;
};

export type QueryParams<FieldType, QueryConditionType> = QueryParamsWithoutCondition<FieldType> & {
    condition: QueryConditionType;
};
