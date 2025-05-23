import { Contest_v0_2_0 } from 'generated';
import { addTransaction } from './utils/sync';
import { GG_MD_POINTER } from './utils/dynamicIndexing';

Contest_v0_2_0.ContestInitialized.handler(async ({ event, context }) => {
  context.Round.set({
    id: event.srcAddress,
    roundAddress: event.srcAddress,
    contestStatus: event.params.status,
    votesModule_id: event.params.votesModule,
    pointsModule_id: event.params.pointsModule,
    choicesModule_id: event.params.choicesModule,
    executionModule_id: event.params.executionModule,
    isContinuous: event.params.isContinuous,
    isRetractable: event.params.isRetractable,
    mdProtocol: event.params.metadata[0],
    mdPointer: event.params.metadata[1],
    totalVoted: 0n,
  });
});
//

Contest_v0_2_0.BatchVote.handler(async ({ event, context }) => {
  await Promise.all(
    event.params.choices.map(async (choiceId, i) => {
      const amount = event.params.amounts[i];

      context.BasicVote.set({
        id: `${event.srcAddress}-${choiceId}-${event.params.voter}`,
        round_id: event.srcAddress,
        choice_id: `choice-${choiceId}`,
        amount: amount,
        batch_id: `batch-${event.transaction.hash}`,
        voter: event.params.voter,
      });

      const choice = await context.BasicChoice.get(
        `choice-${event.params.choices[i]}`
      );

      if (!choice) {
        context.log.error(`Choice ${event.params.choices[i]} not found`);
        return;
      }
      context.BasicChoice.set({
        ...choice,
        amountVoted: choice.amountVoted + amount,
      });
    })
  );

  const round = await context.Round.get(event.srcAddress);

  if (!round) {
    context.log.error(`Round ${event.srcAddress} not found`);
    return;
  }

  const isGG = event.params.metadata[0] === GG_MD_POINTER;

  context.Round.set({
    ...round,
    totalVoted: round.totalVoted + event.params.totalAmount,
  });

  context.BatchVote.set({
    id: `batch-${event.transaction.hash}`,
    timestamp: event.block.timestamp,
    round_id: event.srcAddress,
    voter: event.params.voter,
    totalVoted: event.params.totalAmount,
    comment: isGG ? event.params.metadata[1] : undefined,
  });

  addTransaction(event, context);
});

Contest_v0_2_0.ContestStatusChanged.handler(async ({ event, context }) => {
  const round = await context.Round.get(event.srcAddress);

  if (!round) {
    context.log.error(`Round ${event.srcAddress} not found`);
    return;
  }

  context.Round.set({
    ...round,
    contestStatus: event.params.status,
  });

  addTransaction(event, context);
});
