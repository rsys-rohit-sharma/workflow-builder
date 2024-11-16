import { RequestContext } from '../types';

export interface HarnessConfig {
    sdkKey: string;
}

export type FFTargetContext = {
    req?: Map<string, string>;
    reqContext?: RequestContext;
};
