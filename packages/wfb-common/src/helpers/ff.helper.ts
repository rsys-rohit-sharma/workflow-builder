import axios from 'axios';

import { API_ENDPOINTS } from '../constants';
import { WfbException, ErrorCode } from '../exceptions';
import { RequestContext } from '../types';

export type FFTargetGroupRule = ({
    op: 'addOrg';
} & (
    | {
          orgId: string;
      }
    | {
          tenantId: string;
      }
))[];

export async function addRuleToFFTargetGroup(context: RequestContext, targetGroupId: string, rule: FFTargetGroupRule) {
    const url = API_ENDPOINTS.MODIFY_FF_TARGET_GROUP(targetGroupId);
    try {
        await axios.patch(url, rule);
    } catch (error) {
        throw new WfbException(ErrorCode.UNEXPECTED_ERROR, {
            cause: error,
            details: {
                targetGroupId,
                rule,
                accountId: context.accountId,
            },
        });
    }
}
