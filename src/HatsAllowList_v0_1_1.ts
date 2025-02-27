import { HatsAllowList_v0_1_1 } from 'generated';
import { CURRENT_ROUND, IndexerKey } from './utils/dynamicIndexing';
import { addTransaction } from './utils/sync';

HatsAllowList_v0_1_1.Initialized.handler(async ({ event, context }) => {
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

    const currentDraftVersion = await context.CurrentDraftVersion.get(
      event.params.choiceId
    );

    if (!currentDraftVersion) {
      context.log.error(`Draft version ${event.params.choiceId} not found`);
      return;
    }

    const draft = await context.AppDraft.get(
      `${currentDraftVersion.id}-${currentDraftVersion.version}`
    );

    if (!draft) {
      context.log.error(`Draft ${currentDraftVersion.id} not found`);
      return;
    }

    context.GGApplication.set({
      id: event.params.choiceId,
      registrar: choiceBytes,
      application_id: draft.id,
      postedBy: event.transaction.from || '0xBr0k3n@ddr3ss',
      lastUpdated: event.block.timestamp,
      totalVoted: 0n,
      amountReviewed: 0,
      ggRound_id: event.params.contest,
    });

    context.AppDraft.set({
      ...draft,
      approvedRounds: [...draft.approvedRounds, CURRENT_ROUND],
    });

    addTransaction(event, context);
  }
});

HatsAllowList_v0_1_1.Removed.handler(async ({ event, context }) => {});
