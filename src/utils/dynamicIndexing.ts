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
  GGRubricVote = 'TEST_GG_APPLICATION_REVIEW',
}

export const TAG = {
  APPLICATION_POST: 'GG_APPLICATION_SUBMIT_TEST',
};

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
