import { RubricVotes_v0_1_0 } from 'generated';

RubricVotes_v0_1_0.Initialized.handler(async ({ event, context }) => {
  context.Params_RubricVotes_v0_1_0.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    adminHatId: event.params._adminHatId,
    judgeHatId: event.params._judgeHatId,
  });
});
