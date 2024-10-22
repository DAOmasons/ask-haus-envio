import { BaalGate_v0_2_0 } from 'generated';

BaalGate_v0_2_0.Initialized.handler(async ({ event, context }) => {
  context.Params_BaalGate_v0_2_0.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    dao: event.params.daoAddress,
    lootToken: event.params.lootToken,
    sharesToken: event.params.sharesToken,
    holderType: event.params.holderType,
    holderThreshold: event.params.holderThreshold,
    checkpoint: event.params.checkpoint,
    timed: event.params.timed,
    startTime: event.params.startTime,
    endTime: event.params.endTime,
  });
});
