import { TimedVotes_v0_2_0 } from 'generated';

TimedVotes_v0_2_0.Initialized.handler(async ({ event, context }) => {
  context.Params_TimedVotes_v0_2_0.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    duration: event.params.duration,
    startTime: undefined,
    endTime: undefined,
  });
});

TimedVotes_v0_2_0.VotingStarted.handler(async ({ event, context }) => {
  const params = await context.Params_TimedVotes_v0_2_0.get(event.srcAddress);

  if (!params) {
    context.log.error(`TimedVotes ${event.srcAddress} not found`);
    return;
  }

  context.Params_TimedVotes_v0_2_0.set({
    ...params,
    startTime: event.params.startTime,
    endTime: event.params.endTime,
  });
});
