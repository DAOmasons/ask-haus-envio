import {
  contractRegistrations,
  eventLog,
  FastFactory_ContestCloned_eventArgs,
  handlerContext,
} from 'generated';

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
