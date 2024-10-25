import { Contest_v0_2_0 } from 'generated';

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
  });
});
