import { eventLog, handlerContext } from 'generated';

export const addTransaction = (
  event: eventLog<unknown>,
  context: handlerContext
) => {
  context.TX.set({
    id: event.transaction.hash,
    blockNumber: BigInt(event.block.number),
    srcAddress: event.srcAddress,
    txHash: event.transaction.hash,
    timestamp: event.block.timestamp,
  });
};
