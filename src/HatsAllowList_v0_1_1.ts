import { HatsAllowList_v0_1_1 } from 'generated';
import { IndexerKey } from './utils/dynamicIndexing';
import { addTransaction } from './utils/sync';

HatsAllowList_v0_1_1.Initialized.handler(async ({ event, context }) => {
  context.log.info(event.srcAddress);
  context.Params_HAL_v0_1_1.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    adminHatId: event.params.hatId,
  });
});

HatsAllowList_v0_1_1.Registered.handler(async ({ event, context }) => {
  const choiceModule = await context.ModuleClone.get(event.srcAddress);
  if (!choiceModule) {
    context.log.error(`Module ${event.srcAddress} not found`);
    return;
  }

  const { filterTag } = choiceModule;

  if (!filterTag) {
    context.log.error(`FilterTag ${filterTag} not found`);
    return;
  }

  if (filterTag.includes(IndexerKey.GGRubricVote)) {
    const choiceData = event.params.choiceData;
    const choiceBytes = choiceData[1];
    const application = choiceData[0][1];

    context.GGApplication.set({
      id: `choice-${event.params.choiceId}-${event.srcAddress}`,
      registrar: choiceBytes,
      application,
      validApplication: true,
      postedBy: event.transaction.from || '0xBr0k3n@ddr3ss',
      lastUpdated: event.block.timestamp,
      totalVoted: 0n,
      ggRound_id: event.params.contest,
    });

    addTransaction(event, context);
  }
});

HatsAllowList_v0_1_1.Removed.handler(async ({ event, context }) => {});
