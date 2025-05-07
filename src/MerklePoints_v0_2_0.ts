import { MerklePoints_v0_2_0 } from 'generated';

MerklePoints_v0_2_0.Initialized.handler(async ({ event, context }) => {
  context.Params_MerklePoints_v0_2_0.set({
    id: event.srcAddress,
    clone_id: event.srcAddress,
    merkleRoot: event.params.merkleRoot,
  });
});
