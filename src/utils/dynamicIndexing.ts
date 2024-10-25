export enum ContestVersion {
  v0_1_0 = '0.2.0',
}

export enum Module {
  TimedVotes_v0_2_0 = 'TimedVotes_v0.2.0',
  EmptyExecutionModule_v0_2_0 = 'EmptyExecution_v0.2.0',
  BaalPoints_v0_2_0 = 'BaalPoints_v0.2.0',
  BaalGate_v0_2_0 = 'BaalGate_v0.2.0',
  PrePop_v0_2_0 = 'PrePop_v0.2.0',
}

export enum IndexerKey {
  PollV0 = 'askhaus-poll-v0',
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
    contestVersion === ContestVersion.v0_1_0
  );
};
