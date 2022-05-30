import * as t from 'io-ts';
import { IArticleStatistics, ITotalStatistics } from '../statistics';

export const IAssGetResult = t.union([IArticleStatistics, ITotalStatistics])
export type IAssGetResult = t.TypeOf<typeof IAssGetResult>;

export { IJudgement as IJudgementGetResult } from '../statistics'
