import { PrePop_v0_2_0 } from 'generated';
import { IndexerKey } from './utils/dynamicIndexing';

PrePop_v0_2_0.Initialized.handler(async ({ event, context }) => {
  context.Params_PrePop_v0_2_0.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    numChoices: 0n,
  });
});

PrePop_v0_2_0.Registered.handler(async ({ event, context }) => {
  const keys = Object.values(IndexerKey);
});
