export enum ContestVersion {
  v0_2_0 = '0.2.0',
  v0_2_1 = '0.2.1',
}

export enum Module {
  RubricVotes_v0_1_0 = 'RubricVotes_v0.1.0',
  HatsAllowList_v0_1_1 = 'HatsAllowList_v0.1.1',
  EmptyPoints_v0_1_0 = 'EmptyPoints_v0.1.0',
  TimedVotes_v0_2_0 = 'TimedVotes_v0.2.0',
  EmptyExecutionModule_v0_2_0 = 'EmptyExecution_v0.2.0',
  BaalPoints_v0_2_0 = 'BaalPoints_v0.2.0',
  BaalGate_v0_2_0 = 'BaalGate_v0.2.0',
  PrePop_v0_2_0 = 'PrePop_v0.2.0',
}

export enum IndexerKey {
  PollV0 = 'askhaus-poll-v0',
  ContestV0 = 'askhaus-contest-v0',
  GGRubricVote = 'GG_APPLICATION_JUDGE_VOTE',
}

export const OPEN_REFERRERS: Record<string, string> = {
  '42161': '0xEF62313BDEF239551682F9f2122f6fc2ac22Fd13',
  '421614': '0xF5cBec63a1D4f99F956AB7777ebEb8d822D45D5b',
} as const;

export const HATS_REFERRERS: Record<string, string> = {
  '42161': '0xEE4a919C6Ca25aD2918508F418c52d4209207E52',
  '421614': '0x1D50c6D6e5d18D33E45968C25e3392a8415adAc3',
};

export const TAG = {
  APPLICATION_POST: 'GG_APPDRAFT_SUBMIT',
  APPLICATION_EDIT: 'GG_APPDRAFT_EDIT',
  APPLICATION_COMMENT: 'GG_APPDRAFT_COMMENT',
  APPLICATION_APPROVE: 'GG_APPDRAFT_APPROVE',
  APPLICATION_VOTE: 'GG_APPLICATION_VOTE',
};

export const CURRENT_ROUND = 'GG_23';

export enum Role {
  None,
  System,
  Operator,
  Judge,
  Admin,
}

export const indexerKeys = Object.values(IndexerKey);

export const isImpl = (filterKey: string) => {
  return indexerKeys.some((key) => filterKey.includes(key));
};

export const isAskHausPoll = ({
  filterTag,
  votesModuleName,
  pointsModuleName,
  choicesModuleName,
  contestVersion,
}: {
  filterTag: string;
  votesModuleName: string;
  pointsModuleName: string;
  choicesModuleName: string;
  contestVersion: string;
}) => {
  return (
    filterTag.includes(IndexerKey.PollV0) &&
    votesModuleName === Module.TimedVotes_v0_2_0 &&
    pointsModuleName === Module.BaalPoints_v0_2_0 &&
    choicesModuleName === Module.PrePop_v0_2_0 &&
    contestVersion === ContestVersion.v0_2_0
  );
};

export const isAskHausContest = ({
  filterTag,
  votesModuleName,
  pointsModuleName,
  choicesModuleName,
  contestVersion,
}: {
  filterTag: string;
  votesModuleName: string;
  pointsModuleName: string;
  choicesModuleName: string;
  contestVersion: string;
}) => {
  return (
    filterTag.includes(IndexerKey.ContestV0) &&
    contestVersion === ContestVersion.v0_2_0 &&
    votesModuleName === Module.TimedVotes_v0_2_0 &&
    pointsModuleName === Module.BaalPoints_v0_2_0 &&
    choicesModuleName === Module.BaalGate_v0_2_0
  );
};

export const isGGApplicationVote = ({
  filterTag,
  votesModuleName,
  pointsModuleName,
  choicesModuleName,
  contestVersion,
}: {
  filterTag: string;
  votesModuleName: string;
  pointsModuleName: string;
  choicesModuleName: string;
  contestVersion: string;
}) => {
  return (
    filterTag.includes(IndexerKey.GGRubricVote) &&
    contestVersion === ContestVersion.v0_2_1 &&
    votesModuleName === Module.RubricVotes_v0_1_0 &&
    pointsModuleName === Module.EmptyPoints_v0_1_0 &&
    choicesModuleName === Module.HatsAllowList_v0_1_1
  );
};
