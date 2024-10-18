import { entityHandlerContext, eventLog, handlerContext } from 'generated';
import { TX_t } from 'generated/src/db/Entities.gen';

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
