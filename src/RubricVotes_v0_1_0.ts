import { RubricVotes_v0_1_0 } from 'generated';
import { addTransaction } from './utils/sync';

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
  const params = await context.Params_RubricVotes_v0_1_0.get(event.srcAddress);

  if (!params) {
    context.log.error(`RubricVotes_v0_1_0 not found`);
    return;
  }
  const ggApplication = await context.GGApplication.get(params.roundAddress);

  if (!ggApplication) {
    context.log.error(`GGApplication not found`);
    return;
  }

  // TODO: Create checker to see if vote already exists
  // If so, update vote instead of writing.

  context.GGApplicationVote.set({
    id: `vote-${event.params.choiceId}-${event.transaction.from || 'ERROR'}`,
    createdAt: event.block.timestamp,
    amount: event.params.amount,
    feedback: event.params.reason[1],
    validFeedback: true,
    choice_id: event.params.choiceId,
  });

  addTransaction(event, context);
});
