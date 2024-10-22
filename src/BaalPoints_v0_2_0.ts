import { BaalPoints_v0_2_0 } from 'generated';

BaalPoints_v0_2_0.Initialized.handler(async ({ event, context }) => {
  context.Params_BaalPoints_v0_2_0.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    dao: event.params.dao,
    lootToken: event.params.lootToken,
    sharesToken: event.params.sharesToken,
    checkpoint: event.params.checkpoint,
    holderType: event.params.holderType,
  });
});
