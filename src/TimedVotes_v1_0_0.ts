import { TimedVotes_v1_0_0 } from 'generated';
import { TimerType } from './utils/dynamicIndexing';

TimedVotes_v1_0_0.Initialized.handler(async ({ event, context }) => {
  const startTime =
    Number(event.params.timerType) === TimerType.Auto
      ? BigInt(event.block.number)
      : undefined;

  const endTime =
    Number(event.params.timerType) === TimerType.Auto
      ? BigInt(event.block.number) + event.params.duration
      : undefined;

  context.Params_TimedVotes_v1_0_0.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    duration: event.params.duration,
    startTime,
    endTime,
    adminHatId: event.params.adminHatId,
    timerType: event.params.timerType,
    round: event.params.contest,
  });
});

TimedVotes_v1_0_0.TimerSet.handler(async ({ event, context }) => {
  const params = await context.Params_TimedVotes_v1_0_0.get(event.srcAddress);

  if (!params) {
    // not logging this because this handler does not emit before init if timerType is Auto
    // context.log.error(`Params ${event.srcAddress} not found`);
    return;
  }

  context.Params_TimedVotes_v1_0_0.set({
    ...params,
    startTime: event.params.startTime,
    endTime: event.params.endTime,
  });
});

// TimedVotes_v1_0_0.VoteCast.handler(async ({ event, context }) => {
//   const clone = await context.ModuleClone.get(event.srcAddress);

//   if (!clone || !clone.roundAddress) {
//     context.log.error(`Clone ${event.srcAddress} not found`);
//     return;
//   }

//   const round = await context.Round.get(clone.roundAddress);

//   if (!round) {
//     context.log.error(`Round ${clone.roundAddress} not found`);
//     return;
//   }

//   // is

//   if (!params) {
//     context.log.error(`Params ${event.srcAddress} not found`);
//     return;
//   }
// });
