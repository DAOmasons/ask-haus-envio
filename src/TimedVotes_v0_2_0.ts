import { TimedVotes_v0_2_0 } from 'generated';

TimedVotes_v0_2_0.Initialized.handler(async ({ event, context }) => {
  const params = await context.Params_TimedVotes_v0_2_0.get(event.srcAddress);

  if (!params) {
    context.Params_TimedVotes_v0_2_0.set({
      id: event.srcAddress,
      clone_id: event.srcAddress,
      duration: event.params.duration,
      startTime: undefined,
      endTime: undefined,
    });
  } else {
    context.Params_TimedVotes_v0_2_0.set({
      ...params,
      duration: event.params.duration,
    });
  }
});

TimedVotes_v0_2_0.VotingStarted.handler(async ({ event, context }) => {
  const params = await context.Params_TimedVotes_v0_2_0.get(event.srcAddress);

  if (!params) {
    context.Params_TimedVotes_v0_2_0.set({
      id: event.srcAddress,
      clone_id: event.srcAddress,
      startTime: event.params.startTime,
      endTime: event.params.endTime,
      duration: undefined,
    });
  } else {
    context.Params_TimedVotes_v0_2_0.set({
      ...params,
      startTime: event.params.startTime,
      endTime: event.params.endTime,
    });
  }
});
