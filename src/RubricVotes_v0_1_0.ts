import { RubricVotes_v0_1_0 } from 'generated';
import { addTransaction } from './utils/sync';
import { generateRandomId, truncateAddr } from './utils/common';
import { TAG } from './utils/dynamicIndexing';
import { formatEther } from 'viem';
import { injectLocalLink } from './utils/injection';

RubricVotes_v0_1_0.Initialized.handler(async ({ event, context }) => {
  context.Params_RubricVotes_v0_1_0.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    adminHatId: event.params._adminHatId,
    judgeHatId: event.params._judgeHatId,
    roundAddress: event.params._contest,
  });
});

RubricVotes_v0_1_0.VoteCast.handler(async ({ event, context }) => {
  // TODO: Create checker to see if vote already exists
  // If so, update vote instead of writing.

  context.GGApplicationVote.set({
    id: `vote-${event.params.choiceId}-${event.transaction.from || 'ERROR'}`,
    createdAt: event.block.timestamp,
    reviewer: event.transaction.from || '0xBr0k3n@ddr3ss',
    amount: event.params.amount,
    feedback: event.params.reason[1],
    validFeedback: true,
    choice_id: event.params.choiceId,
  });

  const choice = await context.GGApplication.get(event.params.choiceId);

  if (!choice) {
    context.log.error(`Choice ${event.params.choiceId} not found`);
    return;
  }

  context.GGApplication.set({
    ...choice,
    amountReviewed: choice.amountReviewed + 1,
  });

  context.FeedItem.set({
    id: generateRandomId(),
    topic: choice.id,
    userAddress: event.transaction.from || '0xBr0k3n@ddr3ss',
    createdAt: event.block.timestamp,
    postType: TAG.APPLICATION_VOTE,
    json: JSON.stringify({
      title: 'Application Reviewed',
      body: `This application has been reviewed with a score of ${formatEther(event.params.amount * 100n)}%. See the detailed review ${injectLocalLink({ label: 'here', to: `/review/vote-${choice.id}-${event.transaction.from}` })}.`,
    }),
    ipfsHash: undefined,
  });

  addTransaction(event, context);
});
