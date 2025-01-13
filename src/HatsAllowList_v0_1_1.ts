import { HatsAllowList_v0_1_1 } from 'generated';

HatsAllowList_v0_1_1.Initialized.handler(async ({ event, context }) => {
  context.Params_HAL_v0_1_1.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    adminHatId: event.params.hatId,
  });
});

HatsAllowList_v0_1_1.Registered.handler(async ({ event, context }) => {});

HatsAllowList_v0_1_1.Removed.handler(async ({ event, context }) => {});
